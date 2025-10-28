import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoItem } from '../../tipos-item/entities/tipo-item.entity';
import { CategoriaProducto } from '../../categorias-producto/entities/categoria-producto.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'producto_id' })
  producto_id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  codigo_barras?: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @ManyToOne(() => TipoItem)
  @JoinColumn({ name: 'tipo_item_id' })
  tipo_item: TipoItem;

  @ManyToOne(() => CategoriaProducto)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaProducto;

  @ManyToOne(() => Proveedor, { nullable: true })
  @JoinColumn({ name: 'proveedor_id_preferido' })
  proveedor_preferido?: Proveedor;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  precio_costo_unitario: number;

  @Column({ type: 'varchar', length: 20 })
  unidad_medida: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  registro_ica?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  stock_actual: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  stock_minimo: number;
}
