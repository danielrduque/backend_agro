import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cuentas_estados')
export class CuentaEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
