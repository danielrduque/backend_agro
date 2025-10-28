import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Cajas')
export class Caja {
  @PrimaryGeneratedColumn({ name: 'caja_id' })
  caja_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion?: string;
}
