// src/clientes/entities/cliente.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// Importaremos estas entidades más adelante cuando las creemos.
// import { TipoDocumento } from '../../tipos-documento/entities/tipo-documento.entity';
// import { ListaPrecios } from '../../listas-precios/entities/lista-precios.entity';

@Entity('clientes') // Este nombre debe coincidir con el de tu tabla en la base de datos
export class Cliente {
  @PrimaryGeneratedColumn()
  cliente_id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_completo: string;

  // --- Relaciones ---
  // Aún no hemos creado la entidad TipoDocumento, pero así se vería la relación.
  // @ManyToOne(() => TipoDocumento)
  // @JoinColumn({ name: 'tipo_documento_id' }) // Especifica la columna de la clave foránea
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

  // --- Relaciones ---
  // Así se vería la relación con Listas_Precios.
  // @ManyToOne(() => ListaPrecios)
  // @JoinColumn({ name: 'lista_precio_id' })
  @Column({ type: 'int', default: 1 })
  lista_precio_id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
