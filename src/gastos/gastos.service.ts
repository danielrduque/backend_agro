// src/gastos/gastos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gasto } from './entities/gasto.entity';
import { CreateGastoDto } from './dto/create-gasto.dto';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
  ) {}

  /**
   * @description Crea y guarda un nuevo registro de gasto.
   * @param createGastoDto Datos del gasto a crear.
   * @returns El gasto creado.
   */
  async create(createGastoDto: CreateGastoDto): Promise<Gasto> {
    const nuevoGasto = this.gastoRepository.create(createGastoDto);
    return this.gastoRepository.save(nuevoGasto);
  }

  /**
   * @description Obtiene todos los gastos con sus relaciones.
   * @returns Un arreglo de todos los gastos.
   */
  async findAll(): Promise<Gasto[]> {
    return this.gastoRepository.find({
      relations: ['usuario', 'categoria_gasto', 'metodo_pago', 'sesion_caja'],
    });
  }

  /**
   * @description Busca un gasto específico por su ID.
   * @param id El ID del gasto a buscar.
   * @returns El gasto encontrado.
   */
  async findOne(id: number): Promise<Gasto> {
    const gasto = await this.gastoRepository.findOne({
      where: { gasto_id: id },
      relations: ['usuario', 'categoria_gasto', 'metodo_pago', 'sesion_caja'],
    });

    if (!gasto) {
      throw new NotFoundException(`El gasto con ID #${id} no fue encontrado.`);
    }
    return gasto;
  }
}
