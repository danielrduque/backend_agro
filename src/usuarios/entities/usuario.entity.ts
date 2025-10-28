import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('Usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuario_id' })
  usuario_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre_usuario: string;

  @Column({ type: 'varchar', length: 255 })
  hash_contrasena: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre_completo?: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'rol_id' })
  rol: Role;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
