import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { ListaPrecio } from '../../listas-precios/entities/lista-precio.entity';

@Entity('precios_producto') // Corregido: nombre de la tabla en minúsculas como en tu SQL
@Unique(['producto_id', 'lista_precio_id'])
export class PrecioProducto {
  @PrimaryGeneratedColumn() // No es necesario el { name: ... } si la propiedad se llama igual
  precio_producto_id: number;

  // --- CAMBIO CLAVE 1: Añadir la columna del ID explícitamente ---
  @Column()
  producto_id: number;

  // --- CAMBIO CLAVE 2: Añadir la columna del ID explícitamente ---
  @Column()
  lista_precio_id: number;

  @ManyToOne(() => Producto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' }) // Esto vincula la relación al ID de arriba
  producto: Producto;

  @ManyToOne(() => ListaPrecio, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lista_precio_id' }) // Esto vincula la relación al ID de arriba
  lista_precio: ListaPrecio;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  precio_venta: number;
}
