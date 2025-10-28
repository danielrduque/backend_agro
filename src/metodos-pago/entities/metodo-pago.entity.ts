import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('metodos_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'boolean', default: false })
  es_efectivo: boolean;
}
