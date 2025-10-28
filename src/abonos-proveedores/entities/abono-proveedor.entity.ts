import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CuentaPorPagar } from '../../cuentas-por-pagar/entities/cuenta-por-pagar.entity';
import { SesionCaja } from '../../sesiones-caja/entities/sesion-caja.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';

@Entity('Abonos_Proveedores')
export class AbonoProveedor {
  @PrimaryGeneratedColumn({ name: 'abono_proveedor_id' })
  abono_proveedor_id: number;

  @ManyToOne(() => CuentaPorPagar)
  @JoinColumn({ name: 'cuenta_pagar_id' })
  cuenta_pagar: CuentaPorPagar;

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
