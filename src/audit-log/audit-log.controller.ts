// src/audit-log/audit-log.controller.ts
import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditLogService, AuditLogFilters } from './audit-log.service';

@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'))
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * Obtiene todos los logs con filtros opcionales
   * GET /api/audit-logs?action=CREATE&entity=Producto&limit=50&skip=0
   */
  @Get()
  async findAll(
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const filters: AuditLogFilters = {};
    
    if (action) filters.action = action;
    if (entity) filters.entity = entity;
    if (userId) filters.userId = parseInt(userId, 10);
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (limit) filters.limit = parseInt(limit, 10);
    if (skip) filters.skip = parseInt(skip, 10);

    return this.auditLogService.findAll(filters);
  }

  /**
   * Obtiene estadísticas de auditoría
   * GET /api/audit-logs/stats
   */
  @Get('stats')
  async getStats() {
    return this.auditLogService.getStats();
  }

  /**
   * Obtiene logs de un usuario específico
   * GET /api/audit-logs/user/:id
   */
  @Get('user/:id')
  async findByUser(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.findByUser(
      parseInt(id, 10),
      limit ? parseInt(limit, 10) : 50,
    );
  }

  /**
   * Obtiene logs de una entidad específica
   * GET /api/audit-logs/entity/:name?entityId=123
   */
  @Get('entity/:name')
  async findByEntity(
    @Param('name') name: string,
    @Query('entityId') entityId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.findByEntity(
      name,
      entityId,
      limit ? parseInt(limit, 10) : 50,
    );
  }
}
