// src/abonos-clientes/abonos-clientes.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AbonoCliente } from './entities/abono-cliente.entity';
import { CreateAbonoClienteDto } from './dto/create-abono-cliente.dto';
import { CuentaPorCobrar } from '../cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';
import { CuentaEstado } from '../cuentas-estados/entities/cuenta-estado.entity'; // <-- CORRECCIÓN: Importar CuentaEstado

@Injectable()
export class AbonosClientesService {
  constructor(
    @InjectRepository(AbonoCliente)
    private readonly abonoRepository: Repository<AbonoCliente>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createAbonoDto: CreateAbonoClienteDto): Promise<AbonoCliente> {
    // Iniciamos la transacción (QueryRunner)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // <-- "Modo 'Todo o Nada' activado"

    try {
      const { cuenta_cobrar_id, monto } = createAbonoDto;

      // --- ¡AQUÍ SE MANEJA LA CONCURRENCIA! ---
      // Buscamos la cuenta por cobrar DENTRO de la transacción.
      const cuentaPorCobrar = await queryRunner.manager.findOne(
        CuentaPorCobrar,
        {
          where: { cuenta_cobrar_id },
        },
      );

      if (!cuentaPorCobrar) {
        throw new NotFoundException(
          `La cuenta por cobrar con ID #${cuenta_cobrar_id} no existe.`,
        );
      }

      // (Validación de negocio: no pagar más de lo que se debe)
      if (Number(monto) > Number(cuentaPorCobrar.saldo_pendiente)) {
        throw new BadRequestException(
          `El monto del abono ($${monto}) no puede ser mayor al saldo pendiente ($${cuentaPorCobrar.saldo_pendiente}).`,
        );
      }

      // Actualizamos el saldo de la cuenta por cobrar
      cuentaPorCobrar.saldo_pendiente =
        Number(cuentaPorCobrar.saldo_pendiente) - Number(monto);

      // (Lógica para cambiar estado si se paga completo)
      if (cuentaPorCobrar.saldo_pendiente === 0) {
        cuentaPorCobrar.estado = { id: 2 } as CuentaEstado; // Asumiendo 2 = 'Pagada'
      }

      // *EXPLICACIÓN DE CONCURRENCIA*:
      // Al guardar la 'cuentaPorCobrar' actualizada, la base de datos
      // PONE EN ESPERA (bloquea) a cualquier otro cajero que intente
      // modificar ESTA MISMA cuenta.
      // El Cajero 2 tendrá que esperar, y cuando le toque, leerá
      // el saldo actualizado por el Cajero 1.
      await queryRunner.manager.save(cuentaPorCobrar);

      // Creamos el registro del abono
      const abono = this.abonoRepository.create(createAbonoDto);
      const abonoGuardado = await queryRunner.manager.save(abono);

      // --- ¡ÉXITO! ---
      // Confirmamos los cambios. El saldo de la factura está
      // actualizado y el abono está registrado.
      await queryRunner.commitTransaction();
      return abonoGuardado;
    } catch (error) {
      // --- ¡FALLO! ---
      // Revertimos todo. Ni el saldo se actualiza, ni el abono se crea.
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberamos el controlador.
      await queryRunner.release();
    }
  }

  async findAll(): Promise<AbonoCliente[]> {
    return this.abonoRepository.find({
      relations: ['cuenta_cobrar', 'metodo_pago', 'sesion_caja'],
    });
  }
}
