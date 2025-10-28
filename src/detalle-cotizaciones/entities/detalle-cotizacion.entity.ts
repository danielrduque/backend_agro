import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cotizacion } from '../../cotizaciones/entities/cotizacion.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_cotizaciones')
export class DetalleCotizacion {
  @PrimaryGeneratedColumn({ name: 'detalle_cotizacion_id' })
  detalle_cotizacion_id: number;

  @ManyToOne(() => Cotizacion, (cotizacion) => cotizacion.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Cotizacion;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total_linea: number;
}
