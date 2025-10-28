import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DevolucionVenta } from '../../devoluciones/entities/devolucion.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_devoluciones')
export class DetalleDevolucion {
  @PrimaryGeneratedColumn({ name: 'detalle_devolucion_id' })
  detalle_devolucion_id: number;

  @ManyToOne(() => DevolucionVenta, (devolucion) => devolucion.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'devolucion_id' })
  devolucion: DevolucionVenta;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cantidad: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'precio_unitario_devolucion',
  })
  precio_unitario_devolucion: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'total_linea' })
  total_linea: number;
}
