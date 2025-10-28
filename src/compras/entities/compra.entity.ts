import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';
import { DetalleCompra } from '../../detalle-compras/entities/detalle-compra.entity';

@Entity('Compras')
export class Compra {
  @PrimaryGeneratedColumn({ name: 'compra_id' })
  compra_id: number;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'fecha_compra' })
  fecha_compra: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'numero_factura_proveedor',
  })
  numero_factura_proveedor?: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  impuestos: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total: number;

  @ManyToOne(() => MetodoPago)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodo_pago: MetodoPago;

  @OneToMany(() => DetalleCompra, (detalle) => detalle.compra, {
    cascade: true,
  })
  detalles: DetalleCompra[];
}
