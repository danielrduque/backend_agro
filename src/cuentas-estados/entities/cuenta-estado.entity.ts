import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Cuentas_Estados')
export class CuentaEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
