import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { SesionCaja } from '../../sesiones-caja/entities/sesion-caja.entity';
import { DetalleDevolucion } from '../../detalle-devoluciones/entities/detalle-devolucion.entity';

@Entity('Devoluciones_Venta')
export class DevolucionVenta {
  @PrimaryGeneratedColumn({ name: 'devolucion_id' })
  devolucion_id: number;

  @ManyToOne(() => Venta)
  @JoinColumn({ name: 'venta_id_original' })
  venta_original: Venta;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => SesionCaja)
  @JoinColumn({ name: 'sesion_caja_id' })
  sesion_caja: SesionCaja;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_devolucion',
  })
  fecha_devolucion: Date;

  @Column({ type: 'text', nullable: true })
  motivo?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'total_devuelto' })
  total_devuelto: number;

  @OneToMany(() => DetalleDevolucion, (detalle) => detalle.devolucion, {
    cascade: true,
  })
  detalles: DetalleDevolucion[];
}
