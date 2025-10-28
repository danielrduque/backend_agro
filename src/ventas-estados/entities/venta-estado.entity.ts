import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ventas_estados')
export class VentaEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
