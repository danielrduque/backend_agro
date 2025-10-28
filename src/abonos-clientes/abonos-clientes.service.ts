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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { cuenta_cobrar_id, monto } = createAbonoDto;

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

      if (Number(monto) > Number(cuentaPorCobrar.saldo_pendiente)) {
        throw new BadRequestException(
          `El monto del abono ($${monto}) no puede ser mayor al saldo pendiente ($${cuentaPorCobrar.saldo_pendiente}).`,
        );
      }

      // Actualizamos el saldo de la cuenta por cobrar
      cuentaPorCobrar.saldo_pendiente =
        Number(cuentaPorCobrar.saldo_pendiente) - Number(monto);

      // Opcional: Cambiar el estado de la cuenta si se salda por completo
      if (cuentaPorCobrar.saldo_pendiente === 0) {
        // --- ESTA ES LA LÍNEA CORREGIDA ---
        cuentaPorCobrar.estado = { id: 2 } as CuentaEstado; // Asumiendo que 2 = 'Pagada'
      }

      await queryRunner.manager.save(cuentaPorCobrar);

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

  async findAll(): Promise<AbonoCliente[]> {
    return this.abonoRepository.find({
      relations: ['cuenta_cobrar', 'metodo_pago', 'sesion_caja'],
    });
  }
}
