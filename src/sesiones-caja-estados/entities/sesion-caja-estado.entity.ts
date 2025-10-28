import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sesiones_caja_estados')
export class SesionCajaEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
