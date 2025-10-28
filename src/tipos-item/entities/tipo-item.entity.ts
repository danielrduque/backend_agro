import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Tipos_Item')
export class TipoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
