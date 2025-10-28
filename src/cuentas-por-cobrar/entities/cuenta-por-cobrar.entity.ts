import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { CuentaEstado } from '../../cuentas-estados/entities/cuenta-estado.entity';

@Entity('Cuentas_Por_Cobrar')
export class CuentaPorCobrar {
  @PrimaryGeneratedColumn({ name: 'cuenta_cobrar_id' })
  cuenta_cobrar_id: number;

  @ManyToOne(() => Venta)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

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
