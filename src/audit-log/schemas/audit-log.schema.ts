// src/audit-log/schemas/audit-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true, collection: 'audit_logs' })
export class AuditLog {
  @Prop({ required: true, index: true })
  action: string; // CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.

  @Prop({ required: true, index: true })
  entity: string; // Producto, Venta, Cliente, Usuario, etc.

  @Prop()
  entityId: string; // ID del recurso afectado

  @Prop({ index: true })
  userId: number; // ID del usuario que realizó la acción

  @Prop()
  userName: string; // Nombre del usuario

  @Prop({ type: Object })
  details: Record<string, any>; // Datos adicionales (cambios, antes/después, etc.)

  @Prop({ type: Object })
  requestInfo: {
    method: string;
    url: string;
    ip: string;
    userAgent: string;
  };

  @Prop({ default: Date.now, index: true })
  timestamp: Date;

  @Prop()
  duration: number; // Duración de la operación en ms

  @Prop({ default: 'success' })
  status: string; // success, error

  @Prop()
  errorMessage: string; // Mensaje de error si aplica
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Índices compuestos para consultas frecuentes
AuditLogSchema.index({ entity: 1, timestamp: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, entity: 1, timestamp: -1 });
