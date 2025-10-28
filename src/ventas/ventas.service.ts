// src/ventas/ventas.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Producto } from '../productos/entities/producto.entity';
import { CuentaPorCobrar } from '../cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';
import { VentaEstado } from '../ventas-estados/entities/venta-estado.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';
import { DetalleVenta } from '../detalle-ventas/entities/detalle-venta.entity'; // Importar DetalleVenta

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = this.ventaRepository.create(createVentaDto);
      venta.detalles = [];

      for (const detalleDto of createVentaDto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto con ID #${detalleDto.producto_id} no encontrado.`,
          );
        }
        if (producto.stock_actual < detalleDto.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para el producto "${producto.nombre}". Stock actual: ${producto.stock_actual}.`,
          );
        }

        producto.stock_actual -= detalleDto.cantidad;
        await queryRunner.manager.save(producto);

        // CORRECCIÓN 1: Usar la clase DetalleVenta en lugar de un string
        const detalleVenta = queryRunner.manager.create(
          DetalleVenta,
          detalleDto,
        );
        detalleVenta.producto = producto;
        venta.detalles.push(detalleVenta);
      }

      const ventaGuardada = await queryRunner.manager.save(venta);

      // CORRECCIÓN 2: Usar el ID del DTO original
      const metodoPago = await queryRunner.manager.findOne(MetodoPago, {
        where: { id: createVentaDto.metodo_pago_id },
      });
      // CORRECCIÓN 3: Usar el ID del DTO original
      const estadoVenta = await queryRunner.manager.findOne(VentaEstado, {
        where: { id: createVentaDto.estado_id },
      });

      if (
        estadoVenta?.nombre.toLowerCase() === 'pendiente de pago' &&
        !metodoPago?.es_efectivo
      ) {
        const cuentaPorCobrar = queryRunner.manager.create(CuentaPorCobrar, {
          venta: ventaGuardada,
          // CORRECCIÓN 4: Usar el ID del DTO original
          cliente_id: createVentaDto.cliente_id,
          monto_total: venta.total,
          saldo_pendiente: venta.total,
          estado_id: 1,
        });
        await queryRunner.manager.save(cuentaPorCobrar);
      }

      await queryRunner.commitTransaction();
      // Devolvemos la venta con todas sus relaciones cargadas para una respuesta completa
      return this.findOne(ventaGuardada.venta_id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getVentaReceipt(id: number): Promise<string> {
    // Reutilizamos findOne que ya carga todas las relaciones que necesitamos
    const venta = await this.findOne(id);

    // Construimos el HTML del recibo
    let receipt = `
      <html>
        <head>
          <title>Recibo de Venta #${venta.venta_id}</title>
          <style>
            body { font-family: sans-serif; }
            .receipt { max-width: 300px; margin: auto; padding: 15px; border: 1px solid #eee; }
            h1, h2, h3 { text-align: center; }
            ul { list-style-type: none; padding: 0; }
            li { display: flex; justify-content: space-between; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h1>Recibo de Venta #${venta.venta_id}</h1>
            <p>Fecha: ${venta.fecha_venta.toLocaleDateString()}</p>
            <hr>
            <h2>Cliente:</h2>
            <p>${venta.cliente.nombre_completo}</p>
            ${venta.cliente.numero_documento ? `<p>Documento: ${venta.cliente.numero_documento}</p>` : ''}
            <hr>
            <h2>Detalles:</h2>
            <ul>
    `;

    for (const detalle of venta.detalles) {
      receipt += `
        <li>
          <span>${detalle.cantidad}x ${detalle.producto.nombre}</span>
          <span>$${detalle.total_linea.toFixed(2)}</span>
        </li>
      `;
    }

    receipt += `
            </ul>
            <hr>
            <h3>Total: $${venta.total.toFixed(2)}</h3>
          </div>
        </body>
      </html>
    `;

    return receipt;
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: [
        'cliente',
        'usuario',
        'sesion_caja',
        'metodo_pago',
        'estado',
        'detalles',
        'detalles.producto',
      ],
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { venta_id: id },
      relations: [
        'cliente',
        'usuario',
        'sesion_caja',
        'metodo_pago',
        'estado',
        'detalles',
        'detalles.producto',
      ],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID #${id} no encontrada.`);
    }
    return venta;
  }
}
