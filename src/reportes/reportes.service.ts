// src/reportes/reportes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { DetalleVenta } from '../detalle-ventas/entities/detalle-venta.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepo: Repository<DetalleVenta>,
  ) {}

  /**
   * Obtiene el resumen de ventas (Total vendido y Cantidad de facturas)
   */
  async getReporteVentas(periodo: 'dia' | 'semana' | 'mes') {
    const { fechaInicio, fechaFin } = this.calcularRangoFechas(periodo);

    const query = this.ventaRepo
      .createQueryBuilder('venta')
      .select('COUNT(venta.venta_id)', 'cantidad_ventas')
      .addSelect('SUM(venta.total)', 'total_vendido')
      .where('venta.fecha_venta BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin,
      })
      .andWhere('venta.estado_id != :anulada', { anulada: 3 }); // Asumiendo ID 3 = Anulada

    const resultado = await query.getRawOne();

    return {
      periodo,
      desde: fechaInicio,
      hasta: fechaFin,
      cantidad_ventas: Number(resultado.cantidad_ventas || 0),
      total_vendido: Number(resultado.total_vendido || 0),
    };
  }

  /**
   * Calcula la ganancia real (Venta - Costo)
   * Usa el costo histórico guardado en cada venta, no el actual del producto.
   */
  async getReporteGanancias(periodo: 'dia' | 'semana' | 'mes') {
    const { fechaInicio, fechaFin } = this.calcularRangoFechas(periodo);

    // Fórmula: Suma de ((Precio Venta - Costo) * Cantidad)
    const query = this.detalleVentaRepo
      .createQueryBuilder('detalle')
      .leftJoin('detalle.venta', 'venta')
      .select(
        'SUM((detalle.precio_unitario_venta - detalle.precio_costo_en_venta) * detalle.cantidad)',
        'ganancia_bruta',
      )
      // También traemos el total vendido para calcular el margen
      .addSelect('SUM(detalle.total_linea)', 'total_ingresos')
      .where('venta.fecha_venta BETWEEN :inicio AND :fin', {
        inicio: fechaInicio,
        fin: fechaFin,
      })
      .andWhere('venta.estado_id != :anulada', { anulada: 3 });

    const resultado = await query.getRawOne();
    const ganancia = Number(resultado.ganancia_bruta || 0);
    const ingresos = Number(resultado.total_ingresos || 0);

    // Margen = (Ganancia / Ingresos) * 100
    const margen = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;

    return {
      periodo,
      ganancia_neta: ganancia,
      margen_rentabilidad: margen.toFixed(2) + '%',
      analisis: ganancia > 0 ? 'Rentable' : 'Pérdida/Neutro',
    };
  }

  // Helper privado para obtener fechas
  private calcularRangoFechas(periodo: 'dia' | 'semana' | 'mes') {
    const hoy = new Date();
    const inicio = new Date(hoy);
    const fin = new Date(hoy);

    // Ajustar Fin al final del día de hoy (23:59:59)
    fin.setHours(23, 59, 59, 999);

    switch (periodo) {
      case 'dia':
        // Inicio del día (00:00:00)
        inicio.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        // Primer día de la semana (Lunes o Domingo según config, aquí restamos días)
        const diaSemana = inicio.getDay() || 7; // Convertir Domingo (0) a 7
        inicio.setHours(0, 0, 0, 0);
        inicio.setDate(hoy.getDate() - diaSemana + 1); // Lunes
        break;
      case 'mes':
        // Primer día del mes
        inicio.setHours(0, 0, 0, 0);
        inicio.setDate(1);
        break;
    }

    return { fechaInicio: inicio, fechaFin: fin };
  }
}
