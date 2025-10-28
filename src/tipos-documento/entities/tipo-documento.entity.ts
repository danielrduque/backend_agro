import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Tipos_Documento')
export class TipoDocumento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
