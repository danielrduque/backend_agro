import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CuentaPorCobrar } from '../../cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';
import { SesionCaja } from '../../sesiones-caja/entities/sesion-caja.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';

@Entity('Abonos_Clientes')
export class AbonoCliente {
  @PrimaryGeneratedColumn({ name: 'abono_cliente_id' })
  abono_cliente_id: number;

  @ManyToOne(() => CuentaPorCobrar)
  @JoinColumn({ name: 'cuenta_cobrar_id' })
  cuenta_cobrar: CuentaPorCobrar;

  @ManyToOne(() => SesionCaja, { nullable: true })
  @JoinColumn({ name: 'sesion_caja_id' })
  sesion_caja?: SesionCaja;

  @ManyToOne(() => MetodoPago)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodo_pago: MetodoPago;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_abono',
  })
  fecha_abono: Date;
}
