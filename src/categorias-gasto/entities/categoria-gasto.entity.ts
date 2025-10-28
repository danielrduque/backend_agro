import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categorias_gasto')
export class CategoriaGasto {
  @PrimaryGeneratedColumn({ name: 'categoria_gasto_id' })
  categoria_gasto_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
}
