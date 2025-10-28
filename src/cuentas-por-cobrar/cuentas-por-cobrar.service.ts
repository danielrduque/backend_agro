// src/cuentas-por-cobrar/cuentas-por-cobrar.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CuentaPorCobrar } from './entities/cuenta-por-cobrar.entity';

@Injectable()
export class CuentasPorCobrarService {
  constructor(
    @InjectRepository(CuentaPorCobrar)
    private readonly cxcRepository: Repository<CuentaPorCobrar>,
  ) {}

  async findAll(): Promise<CuentaPorCobrar[]> {
    return this.cxcRepository.find({
      relations: ['cliente', 'venta', 'estado'],
    });
  }

  async findOne(id: number): Promise<CuentaPorCobrar> {
    const cuenta = await this.cxcRepository.findOne({
      where: { cuenta_cobrar_id: id },
      relations: ['cliente', 'venta', 'estado'],
    });
    if (!cuenta) {
      throw new NotFoundException(
        `Cuenta por cobrar con ID #${id} no encontrada.`,
      );
    }
    return cuenta;
  }

  /**
   * @description Reporte de Cartera: Busca todas las cuentas con saldo pendiente.
   */
  async findPendientes(): Promise<CuentaPorCobrar[]> {
    return this.cxcRepository.find({
      where: {
        saldo_pendiente: MoreThan(0),
      },
      relations: ['cliente', 'venta'],
      order: {
        fecha_vencimiento: 'ASC',
      },
    });
  }
}
