// src/abonos-proveedores/abonos-proveedores.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbonoProveedor } from './entities/abono-proveedor.entity';
import { CreateAbonoProveedorDto } from './dto/create-abono-proveedor.dto';
import { CuentaPorPagar } from '../cuentas-por-pagar/entities/cuenta-por-pagar.entity';
import { CuentaEstado } from '../cuentas-estados/entities/cuenta-estado.entity';

@Injectable()
export class AbonosProveedoresService {
  constructor(
    @InjectRepository(AbonoProveedor)
    private readonly abonoRepository: Repository<AbonoProveedor>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createAbonoDto: CreateAbonoProveedorDto,
  ): Promise<AbonoProveedor> {
    // Iniciamos la transacción (QueryRunner)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // <-- "Modo 'Todo o Nada' activado"

    try {
      const { cuenta_pagar_id, monto } = createAbonoDto;

      // --- ¡AQUÍ SE MANEJA LA CONCURRENCIA! ---
      // Buscamos la cuenta por pagar DENTRO de la transacción.
      const cuentaPorPagar = await queryRunner.manager.findOne(CuentaPorPagar, {
        where: { cuenta_pagar_id },
      });

      if (!cuentaPorPagar) {
        throw new NotFoundException(
          `La cuenta por pagar con ID #${cuenta_pagar_id} no existe.`,
        );
      }

      // (Validación de negocio)
      if (Number(monto) > Number(cuentaPorPagar.saldo_pendiente)) {
        throw new BadRequestException(
          `El monto del abono ($${monto}) no puede ser mayor al saldo pendiente ($${cuentaPorPagar.saldo_pendiente}).`,
        );
      }

      // Actualizamos el saldo
      cuentaPorPagar.saldo_pendiente =
        Number(cuentaPorPagar.saldo_pendiente) - Number(monto);

      if (cuentaPorPagar.saldo_pendiente === 0) {
        cuentaPorPagar.estado = { id: 2 } as CuentaEstado; // Asumiendo 2 = 'Pagada'
      }

      // *EXPLICACIÓN DE CONCURRENCIA*:
      // Al guardar la 'cuentaPorPagar' actualizada, la base de datos
      // PONE EN ESPERA (bloquea) a cualquier otra persona que intente
      // modificar ESTA MISMA cuenta por pagar.
      // Esto asegura que los pagos se descuenten en orden y el saldo
      // siempre sea correcto.
      await queryRunner.manager.save(cuentaPorPagar);

      // Creamos el registro del abono
      const abono = this.abonoRepository.create(createAbonoDto);
      const abonoGuardado = await queryRunner.manager.save(abono);

      // --- ¡ÉXITO! ---
      await queryRunner.commitTransaction();
      return abonoGuardado;
    } catch (error) {
      // --- ¡FALLO! ---
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberamos el controlador.
      await queryRunner.release();
    }
  }

  async findAll(): Promise<AbonoProveedor[]> {
    return this.abonoRepository.find({
      relations: ['cuenta_pagar', 'metodo_pago', 'sesion_caja'],
    });
  }
}
