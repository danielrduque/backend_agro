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
import { CotizacionEstado } from '../../cotizaciones-estados/entities/cotizacion-estado.entity';
import { DetalleCotizacion } from '../../detalle-cotizaciones/entities/detalle-cotizacion.entity';

@Entity('Cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn({ name: 'cotizacion_id' })
  cotizacion_id: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => CotizacionEstado)
  @JoinColumn({ name: 'estado_id' })
  estado: CotizacionEstado;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
    name: 'fecha_cotizacion',
  })
  fecha_cotizacion: Date;

  @Column({ type: 'date', nullable: true, name: 'fecha_vencimiento' })
  fecha_vencimiento?: Date;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  total?: number;

  @OneToMany(() => DetalleCotizacion, (detalle) => detalle.cotizacion, {
    cascade: true,
  })
  detalles: DetalleCotizacion[];
}
