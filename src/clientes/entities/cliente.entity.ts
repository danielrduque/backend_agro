// src/clientes/entities/cliente.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany, // Importa OneToMany
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity'; // Asegúrate de que la ruta sea correcta
import { CuentaPorCobrar } from '../../cuentas-por-cobrar/entities/cuenta-por-cobrar.entity'; // Asegúrate de que la ruta sea correcta

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  cliente_id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_completo: string;

  @Column({ type: 'int', nullable: false })
  tipo_documento_id: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  numero_documento: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'int', default: 1 })
  lista_precio_id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  // --- NUEVAS RELACIONES ---
  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];

  @OneToMany(() => CuentaPorCobrar, (cuenta) => cuenta.cliente)
  cuentas_por_cobrar: CuentaPorCobrar[];
}
