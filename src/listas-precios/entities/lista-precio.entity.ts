import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Listas_Precios')
export class ListaPrecio {
  @PrimaryGeneratedColumn({ name: 'lista_precio_id' })
  lista_precio_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
