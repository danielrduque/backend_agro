import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Cotizaciones_Estados')
export class CotizacionEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
