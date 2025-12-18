import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Producto } from '../productos/entities/producto.entity';
import { CuentaPorCobrar } from '../cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';
import { VentaEstado } from '../ventas-estados/entities/venta-estado.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';
import { DetalleVenta } from '../detalle-ventas/entities/detalle-venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly dataSource: DataSource,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createVentaDto: CreateVentaDto, user: any): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Buscamos al Cliente para saber si es mayorista
      const cliente = await queryRunner.manager.findOne(Cliente, {
        where: { cliente_id: createVentaDto.cliente_id },
      });

      if (!cliente) {
        throw new NotFoundException(
          `Cliente con ID #${createVentaDto.cliente_id} no encontrado.`,
        );
      }

      // Preparamos la cabecera de la venta
      const ventaData = {
        ...createVentaDto,
        usuario: { usuario_id: user.usuario_id },
        cliente: { cliente_id: createVentaDto.cliente_id },
        sesion_caja: { sesion_id: createVentaDto.sesion_caja_id },
        metodo_pago: { id: createVentaDto.metodo_pago_id },
        estado: { id: createVentaDto.estado_id },
      };

      const venta = this.ventaRepository.create(ventaData);
      venta.detalles = [];

      // Variables para recalcular los totales generales basados en los precios reales
      let totalSubtotalVenta = 0;
      let totalImpuestosVenta = 0;
      let totalFinalVenta = 0;

      // --- INICIO DE LA PARTE CRÍTICA ---
      for (const detalleDto of createVentaDto.detalles) {
        // Buscamos el producto
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto con ID #${detalleDto.producto_id} no encontrado.`,
          );
        }

        // Validamos stock
        if (producto.stock_actual < detalleDto.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para el producto "${producto.nombre}". Stock actual: ${producto.stock_actual}.`,
          );
        }

        // -----------------------------------------------------------
        // 👇 LÓGICA DE PRECIOS AUTOMÁTICOS
        // -----------------------------------------------------------

        // A. Determinar Precio Base
        // Usamos el precio de venta del producto si existe (>0),
        // si no, usamos el que enviaron manualmente en el JSON (respaldo).
        let precioFinal =
          Number(producto.precio_venta) > 0
            ? Number(producto.precio_venta)
            : Number(detalleDto.precio_unitario_venta);

        // B. Aplicar Descuento Mayorista (Lista #2)
        // Si el cliente tiene asignada la lista 2, le bajamos el 10%
        if (cliente.lista_precio_id === 2) {
          precioFinal = precioFinal * 0.9;
        }

        // C. Calcular Totales de la Línea
        const subtotalLinea = precioFinal * detalleDto.cantidad;
        const impuestosLinea = Number(detalleDto.impuestos_linea); // Mantenemos impuestos del DTO
        const totalLinea = subtotalLinea + impuestosLinea;

        // Acumulamos para el total general de la factura
        totalSubtotalVenta += subtotalLinea;
        totalImpuestosVenta += impuestosLinea;
        totalFinalVenta += totalLinea;

        // -----------------------------------------------------------

        // Descontamos stock
        producto.stock_actual =
          Number(producto.stock_actual) - Number(detalleDto.cantidad);

        await queryRunner.manager.save(producto);

        // Creamos el detalle con los precios calculados
        const detalleVenta = queryRunner.manager.create(DetalleVenta, {
          ...detalleDto,
          producto: producto,
          precio_unitario_venta: precioFinal, // 👈 Precio ya con descuento
          subtotal_linea: subtotalLinea,
          total_linea: totalLinea,
        });

        venta.detalles.push(detalleVenta);
      }
      // --- FIN DE LA PARTE CRÍTICA ---

      // Actualizamos los totales de la cabecera con lo que calculamos realmente
      venta.subtotal = totalSubtotalVenta;
      venta.impuestos = totalImpuestosVenta;
      venta.total = totalFinalVenta;

      // Guardamos la venta principal
      const ventaGuardada = await queryRunner.manager.save(venta);

      // (Lógica de Cuenta por Cobrar)
      const metodoPago = await queryRunner.manager.findOne(MetodoPago, {
        where: { id: createVentaDto.metodo_pago_id },
      });
      const estadoVenta = await queryRunner.manager.findOne(VentaEstado, {
        where: { id: createVentaDto.estado_id },
      });

      if (
        estadoVenta?.nombre.toLowerCase() === 'pendiente de pago' &&
        !metodoPago?.es_efectivo
      ) {
        const cuentaPorCobrar = queryRunner.manager.create(CuentaPorCobrar, {
          venta: ventaGuardada,
          cliente: { cliente_id: createVentaDto.cliente_id },
          monto_total: venta.total,
          saldo_pendiente: venta.total,
          estado: { id: 2 },
        });
        await queryRunner.manager.save(cuentaPorCobrar);
      }

      await queryRunner.commitTransaction();

      // Obtener venta completa con relaciones para la notificación
      const ventaCompleta = await this.findOne(ventaGuardada.venta_id);

      // Emitir notificación en tiempo real de nueva venta
      this.notificationsGateway.notifyNewSale(ventaCompleta);

      // Verificar si algún producto quedó con stock bajo
      for (const detalle of createVentaDto.detalles) {
        const productoActualizado = await this.productoRepository.findOne({
          where: { producto_id: detalle.producto_id },
        });
        if (productoActualizado && Number(productoActualizado.stock_actual) <= 5) {
          this.notificationsGateway.notifyLowStock(productoActualizado);
        }
      }

      return ventaCompleta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getVentaReceipt(id: number): Promise<string> {
    const venta = await this.findOne(id);
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
          <span>$${detalle.total_linea}</span>
        </li>
      `;
    }

    receipt += `
            </ul>
            <hr>
            <h3>Total: $${venta.total}</h3>
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
