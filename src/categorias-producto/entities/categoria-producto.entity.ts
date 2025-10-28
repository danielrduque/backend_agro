import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Categorias_Producto')
export class CategoriaProducto {
  @PrimaryGeneratedColumn({ name: 'categoria_id' })
  categoria_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
