import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { SesionCaja } from '../../sesiones-caja/entities/sesion-caja.entity';
import { CategoriaGasto } from '../../categorias-gasto/entities/categoria-gasto.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';

@Entity('gastos')
export class Gasto {
  @PrimaryGeneratedColumn({ name: 'gasto_id' })
  gasto_id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => SesionCaja, { nullable: true })
  @JoinColumn({ name: 'sesion_caja_id' })
  sesion_caja?: SesionCaja;

  @ManyToOne(() => CategoriaGasto)
  @JoinColumn({ name: 'categoria_gasto_id' })
  categoria_gasto: CategoriaGasto;

  @ManyToOne(() => MetodoPago)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodo_pago: MetodoPago;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_gasto',
  })
  fecha_gasto: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto: number;

  @Column({ type: 'text' })
  descripcion: string;
}
