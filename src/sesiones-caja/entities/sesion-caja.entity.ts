import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Caja } from '../../cajas/entities/caja.entity';
import { SesionCajaEstado } from '../../sesiones-caja-estados/entities/sesion-caja-estado.entity';

@Entity('sesiones_caja')
export class SesionCaja {
  @PrimaryGeneratedColumn({ name: 'sesion_id' })
  sesion_id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Caja)
  @JoinColumn({ name: 'caja_id' })
  caja: Caja;

  @ManyToOne(() => SesionCajaEstado)
  @JoinColumn({ name: 'estado_id' })
  estado: SesionCajaEstado;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_apertura',
  })
  fecha_apertura: Date;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'monto_base_inicial',
  })
  monto_base_inicial: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'fecha_cierre' })
  fecha_cierre?: Date;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'monto_contado_final',
  })
  monto_contado_final?: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    name: 'monto_esperado_final',
  })
  monto_esperado_final?: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  diferencia?: number;

  @Column({ type: 'text', nullable: true, name: 'notas_cierre' })
  notas_cierre?: string;
}
