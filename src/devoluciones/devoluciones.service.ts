// src/devoluciones/devoluciones.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DevolucionVenta } from './entities/devolucion.entity';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { DetalleDevolucion } from '../detalle-devoluciones/entities/detalle-devolucion.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { SesionCaja } from '../sesiones-caja/entities/sesion-caja.entity';

@Injectable()
export class DevolucionesService {
  constructor(
    @InjectRepository(DevolucionVenta)
    private readonly devolucionRepository: Repository<DevolucionVenta>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDevolucionDto: CreateDevolucionDto,
  ): Promise<DevolucionVenta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar que la venta original existe
      const venta = await queryRunner.manager.findOne(Venta, {
        where: { venta_id: createDevolucionDto.venta_id_original },
      });
      if (!venta) {
        throw new NotFoundException(
          `Venta original con ID #${createDevolucionDto.venta_id_original} no encontrada.`,
        );
      }

      // 2. Validar sesión de caja (necesaria si hay devolución de dinero)
      const sesion = await queryRunner.manager.findOne(SesionCaja, {
        where: { sesion_id: createDevolucionDto.sesion_caja_id },
      });
      if (!sesion) {
        throw new NotFoundException(
          `Sesión de caja con ID #${createDevolucionDto.sesion_caja_id} no encontrada.`,
        );
      }

      // 3. Crear cabecera de la devolución
      const nuevaDevolucion = this.devolucionRepository.create({
        venta_original: { venta_id: createDevolucionDto.venta_id_original },
        usuario: { usuario_id: createDevolucionDto.usuario_id },
        sesion_caja: { sesion_id: createDevolucionDto.sesion_caja_id },
        motivo: createDevolucionDto.motivo,
        total_devuelto: createDevolucionDto.total_devuelto,
        detalles: [],
      });

      // 4. Procesar detalles y DEVOLVER STOCK
      for (const detalleDto of createDevolucionDto.detalles) {
        // A. Buscar Producto
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto ID #${detalleDto.producto_id} no encontrado.`,
          );
        }

        // B. Aumentar Stock (Regresa el producto al inventario)
        // Bloqueamos el producto para concurrencia
        producto.stock_actual =
          Number(producto.stock_actual) + Number(detalleDto.cantidad);

        await queryRunner.manager.save(producto);

        // C. Crear detalle de devolución
        const detalleDevolucion = queryRunner.manager.create(
          DetalleDevolucion,
          {
            producto: producto,
            cantidad: detalleDto.cantidad,
            precio_unitario_devolucion: detalleDto.precio_unitario_devolucion,
            total_linea: detalleDto.total_linea,
          },
        );

        nuevaDevolucion.detalles.push(detalleDevolucion);
      }

      // 5. Guardar Devolución completa
      const devolucionGuardada =
        await queryRunner.manager.save(nuevaDevolucion);

      // Confirmar transacción
      await queryRunner.commitTransaction();

      return this.findOne(devolucionGuardada.devolucion_id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<DevolucionVenta[]> {
    return this.devolucionRepository.find({
      relations: ['venta_original', 'usuario', 'detalles', 'detalles.producto'],
    });
  }

  async findOne(id: number): Promise<DevolucionVenta> {
    const devolucion = await this.devolucionRepository.findOne({
      where: { devolucion_id: id },
      relations: ['venta_original', 'usuario', 'detalles', 'detalles.producto'],
    });

    if (!devolucion) {
      throw new NotFoundException(`Devolución con ID #${id} no encontrada.`);
    }
    return devolucion;
  }
}
