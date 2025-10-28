import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('Detalle_Ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn({ name: 'detalle_id' })
  detalle_id: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  precio_unitario_venta: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  precio_costo_en_venta: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  subtotal_linea: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  impuestos_linea: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total_linea: number;
}
