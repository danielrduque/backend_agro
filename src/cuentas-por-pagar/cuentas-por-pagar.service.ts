// src/cuentas-por-pagar/cuentas-por-pagar.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CuentaPorPagar } from './entities/cuenta-por-pagar.entity';

@Injectable()
export class CuentasPorPagarService {
  constructor(
    @InjectRepository(CuentaPorPagar)
    private readonly cxpRepository: Repository<CuentaPorPagar>,
  ) {}

  findAll(): Promise<CuentaPorPagar[]> {
    return this.cxpRepository.find({
      relations: ['proveedor', 'compra', 'estado'],
    });
  }

  async findOne(id: number): Promise<CuentaPorPagar> {
    const cuenta = await this.cxpRepository.findOne({
      where: { cuenta_pagar_id: id },
      relations: ['proveedor', 'compra', 'estado'],
    });
    if (!cuenta) {
      throw new NotFoundException(
        `Cuenta por pagar con ID #${id} no encontrada.`,
      );
    }
    return cuenta;
  }

  findPendientes(): Promise<CuentaPorPagar[]> {
    return this.cxpRepository.find({
      where: {
        saldo_pendiente: MoreThan(0),
      },
      relations: ['proveedor', 'compra'],
      order: {
        fecha_vencimiento: 'ASC',
      },
    });
  }
}
