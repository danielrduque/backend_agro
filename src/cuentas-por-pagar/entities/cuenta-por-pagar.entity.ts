import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { CuentaEstado } from '../../cuentas-estados/entities/cuenta-estado.entity';

@Entity('Cuentas_Por_Pagar')
export class CuentaPorPagar {
  @PrimaryGeneratedColumn({ name: 'cuenta_pagar_id' })
  cuenta_pagar_id: number;

  @ManyToOne(() => Compra)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @ManyToOne(() => CuentaEstado)
  @JoinColumn({ name: 'estado_id' })
  estado: CuentaEstado;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'monto_total' })
  monto_total: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'saldo_pendiente' })
  saldo_pendiente: number;

  @Column({ type: 'date', nullable: true, name: 'fecha_vencimiento' })
  fecha_vencimiento?: Date;
}
