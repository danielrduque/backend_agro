// src/audit-log/audit-log.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

export interface CreateAuditLogDto {
  action: string;
  entity: string;
  entityId?: string;
  userId?: number;
  userName?: string;
  details?: Record<string, any>;
  requestInfo?: {
    method: string;
    url: string;
    ip: string;
    userAgent: string;
  };
  duration?: number;
  status?: string;
  errorMessage?: string;
}

export interface AuditLogFilters {
  action?: string;
  entity?: string;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private auditLogModel: Model<AuditLogDocument>,
  ) {}

  /**
   * Crea un nuevo registro de auditoría
   */
  async create(createDto: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const auditLog = new this.auditLogModel({
        ...createDto,
        timestamp: new Date(),
      });
      const saved = await auditLog.save();
      this.logger.debug(
        `📝 Log: ${createDto.action} ${createDto.entity} by User#${createDto.userId}`,
      );
      return saved;
    } catch (error) {
      this.logger.error('Error guardando log de auditoría:', error);
      throw error;
    }
  }

  /**
   * Obtiene logs con filtros y paginación
   */
  async findAll(filters: AuditLogFilters = {}): Promise<{
    logs: AuditLog[];
    total: number;
  }> {
    const query: any = {};

    if (filters.action) query.action = filters.action;
    if (filters.entity) query.entity = filters.entity;
    if (filters.userId) query.userId = filters.userId;

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) query.timestamp.$gte = filters.startDate;
      if (filters.endDate) query.timestamp.$lte = filters.endDate;
    }

    const limit = filters.limit || 50;
    const skip = filters.skip || 0;

    const [logs, total] = await Promise.all([
      this.auditLogModel
        .find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .exec(),
      this.auditLogModel.countDocuments(query),
    ]);

    return { logs, total };
  }

  /**
   * Obtiene logs de un usuario específico
   */
  async findByUser(
    userId: number,
    limit = 50,
  ): Promise<AuditLog[]> {
    return this.auditLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Obtiene logs de una entidad específica
   */
  async findByEntity(
    entity: string,
    entityId?: string,
    limit = 50,
  ): Promise<AuditLog[]> {
    const query: any = { entity };
    if (entityId) query.entityId = entityId;

    return this.auditLogModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Obtiene estadísticas de acciones
   */
  async getStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [actionStats, entityStats, todayCount] = await Promise.all([
      this.auditLogModel.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.auditLogModel.aggregate([
        { $group: { _id: '$entity', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.auditLogModel.countDocuments({ timestamp: { $gte: today } }),
    ]);

    return {
      byAction: actionStats,
      byEntity: entityStats,
      todayCount,
      totalCount: await this.auditLogModel.countDocuments(),
    };
  }

  /**
   * Método helper para registrar acciones comunes
   */
  async logAction(
    action: string,
    entity: string,
    details: Record<string, any> = {},
    userId?: number,
    userName?: string,
  ) {
    return this.create({
      action,
      entity,
      entityId: details.id?.toString(),
      userId,
      userName,
      details,
    });
  }
}
