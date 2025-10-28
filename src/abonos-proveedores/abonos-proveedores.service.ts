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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { cuenta_pagar_id, monto } = createAbonoDto;

      const cuentaPorPagar = await queryRunner.manager.findOne(CuentaPorPagar, {
        where: { cuenta_pagar_id },
      });

      if (!cuentaPorPagar) {
        throw new NotFoundException(
          `La cuenta por pagar con ID #${cuenta_pagar_id} no existe.`,
        );
      }

      if (Number(monto) > Number(cuentaPorPagar.saldo_pendiente)) {
        throw new BadRequestException(
          `El monto del abono ($${monto}) no puede ser mayor al saldo pendiente ($${cuentaPorPagar.saldo_pendiente}).`,
        );
      }

      // Actualizamos el saldo
      cuentaPorPagar.saldo_pendiente =
        Number(cuentaPorPagar.saldo_pendiente) - Number(monto);

      // Si se salda la deuda, cambiamos el estado
      if (cuentaPorPagar.saldo_pendiente === 0) {
        cuentaPorPagar.estado = { id: 2 } as CuentaEstado; // Asumiendo que 2 = 'Pagada'
      }

      await queryRunner.manager.save(cuentaPorPagar);

      // Creamos el registro del abono
      const abono = this.abonoRepository.create(createAbonoDto);
      const abonoGuardado = await queryRunner.manager.save(abono);

      await queryRunner.commitTransaction();
      return abonoGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<AbonoProveedor[]> {
    return this.abonoRepository.find({
      relations: ['cuenta_pagar', 'metodo_pago', 'sesion_caja'],
    });
  }
}
