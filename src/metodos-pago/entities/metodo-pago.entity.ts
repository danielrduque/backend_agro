import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Metodos_Pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'boolean', default: false })
  es_efectivo: boolean;
}
