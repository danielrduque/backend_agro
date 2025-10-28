import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('Detalle_Compras')
export class DetalleCompra {
  @PrimaryGeneratedColumn({ name: 'detalle_compra_id' })
  detalle_compra_id: number;

  @ManyToOne(() => Compra, (compra) => compra.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  precio_costo_unitario: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total_linea: number;
}
