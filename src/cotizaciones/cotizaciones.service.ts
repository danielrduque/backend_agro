// src/cotizaciones/cotizaciones.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { DetalleCotizacion } from '../detalle-cotizaciones/entities/detalle-cotizacion.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear cabecera
      const cotizacionData = {
        cliente: { cliente_id: createCotizacionDto.cliente_id },
        usuario: { usuario_id: createCotizacionDto.usuario_id },
        estado: { id: createCotizacionDto.estado_id },
        fecha_vencimiento: createCotizacionDto.fecha_vencimiento
          ? new Date(createCotizacionDto.fecha_vencimiento)
          : undefined,
        total: createCotizacionDto.total,
      };

      const nuevaCotizacion = this.cotizacionRepository.create(cotizacionData);
      nuevaCotizacion.detalles = [];

      // Procesar detalles (Nota: NO descontamos stock en cotización)
      for (const detalleDto of createCotizacionDto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto ID #${detalleDto.producto_id} no encontrado.`,
          );
        }

        const detalleCotizacion = queryRunner.manager.create(
          DetalleCotizacion,
          {
            producto: producto,
            cantidad: detalleDto.cantidad,
            precio_unitario: detalleDto.precio_unitario,
            total_linea: detalleDto.total_linea,
          },
        );

        nuevaCotizacion.detalles.push(detalleCotizacion);
      }

      const cotizacionGuardada =
        await queryRunner.manager.save(nuevaCotizacion);
      await queryRunner.commitTransaction();

      return this.findOne(cotizacionGuardada.cotizacion_id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Cotizacion[]> {
    return this.cotizacionRepository.find({
      relations: [
        'cliente',
        'usuario',
        'estado',
        'detalles',
        'detalles.producto',
      ],
    });
  }

  async findOne(id: number): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { cotizacion_id: id },
      relations: [
        'cliente',
        'usuario',
        'estado',
        'detalles',
        'detalles.producto',
      ],
    });

    if (!cotizacion) {
      throw new NotFoundException(`Cotización con ID #${id} no encontrada.`);
    }
    return cotizacion;
  }

  // TODO: Método para convertirCotizacionAVenta (Futura implementación)
}
