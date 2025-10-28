import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { SesionCaja } from '../../sesiones-caja/entities/sesion-caja.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';
import { VentaEstado } from '../../ventas-estados/entities/venta-estado.entity';
import { DetalleVenta } from '../../detalle-ventas/entities/detalle-venta.entity';

@Entity('Ventas')
export class Venta {
  @PrimaryGeneratedColumn({ name: 'venta_id' })
  venta_id: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => SesionCaja)
  @JoinColumn({ name: 'sesion_caja_id' })
  sesion_caja: SesionCaja;

  @ManyToOne(() => MetodoPago)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodo_pago: MetodoPago;

  @ManyToOne(() => VentaEstado)
  @JoinColumn({ name: 'estado_id' })
  estado: VentaEstado;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  numero_factura?: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_venta',
  })
  fecha_venta: Date;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  impuestos: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total: number;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta, { cascade: true })
  detalles: DetalleVenta[];
}
