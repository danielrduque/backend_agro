import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cotizaciones_estados')
export class CotizacionEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
