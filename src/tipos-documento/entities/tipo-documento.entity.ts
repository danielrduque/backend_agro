import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_documento')
export class TipoDocumento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
