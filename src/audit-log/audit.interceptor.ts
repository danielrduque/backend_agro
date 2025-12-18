// src/audit-log/audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuditLogService } from './audit-log.service';

/**
 * Interceptor global que registra automáticamente las operaciones CRUD
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers, user, body } = request;
    const userAgent = headers['user-agent'] || '';
    
    // Solo auditar operaciones que modifican datos
    const methodsToAudit = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!methodsToAudit.includes(method)) {
      return next.handle();
    }

    // Excluir ciertas rutas
    const excludedPaths = ['/auth/login', '/auth/refresh', '/audit-logs'];
    if (excludedPaths.some(path => url.includes(path))) {
      return next.handle();
    }

    const startTime = Date.now();
    
    // Determinar la acción y entidad basado en el método y URL
    const action = this.getAction(method);
    const entity = this.extractEntity(url);

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - startTime;
        
        // Registrar log de éxito
        this.auditLogService.create({
          action,
          entity,
          entityId: this.extractEntityId(url, response),
          userId: this.extractUserId(user),
          userName: this.extractUserName(user),
          details: {
            requestBody: this.sanitizeBody(body),
            responseId: this.extractEntityId(url, response),
          },
          requestInfo: {
            method,
            url,
            ip: ip || request.connection?.remoteAddress,
            userAgent,
          },
          duration,
          status: 'success',
        }).catch(err => this.logger.error('Error logging audit:', err));
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        
        // Registrar log de error
        this.auditLogService.create({
          action,
          entity,
          entityId: this.extractEntityId(url),
          userId: this.extractUserId(user),
          userName: this.extractUserName(user),
          details: {
            requestBody: this.sanitizeBody(body),
          },
          requestInfo: {
            method,
            url,
            ip: ip || request.connection?.remoteAddress,
            userAgent,
          },
          duration,
          status: 'error',
          errorMessage: error.message,
        }).catch(err => this.logger.error('Error logging audit:', err));
        
        return throwError(() => error);
      }),
    );
  }

  private getAction(method: string): string {
    const actions: Record<string, string> = {
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };
    return actions[method] || method;
  }

  private extractEntity(url: string): string {
    // Mapeo de rutas a nombres de entidad legibles
    const entityMap: Record<string, string> = {
      'productos': 'Producto',
      'clientes': 'Cliente',
      'ventas': 'Venta',
      'compras': 'Compra',
      'proveedores': 'Proveedor',
      'usuarios': 'Usuario',
      'gastos': 'Gasto',
      'sesiones-caja': 'SesionCaja',
      'cotizaciones': 'Cotizacion',
      'abonos-clientes': 'AbonoCliente',
      'abonos-proveedores': 'AbonoProveedor',
      'cuentas-por-cobrar': 'CuentaPorCobrar',
      'cuentas-por-pagar': 'CuentaPorPagar',
      'cajas': 'Caja',
      'roles': 'Rol',
      'metodos-pago': 'MetodoPago',
      'categorias-producto': 'CategoriaProducto',
      'tipos-item': 'TipoItem',
      'listas-precios': 'ListaPrecio',
      'devoluciones': 'Devolucion',
    };

    // Extraer el nombre de la entidad del URL
    const parts = url.split('/').filter(p => p && p !== 'api');
    
    if (parts.length > 0) {
      const entityKey = parts[0].toLowerCase();
      return entityMap[entityKey] || this.capitalizeFirst(entityKey);
    }
    
    return 'Unknown';
  }

  private capitalizeFirst(str: string): string {
    // Convertir kebab-case a PascalCase
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private extractEntityId(url: string, response?: any): string {
    // Intentar extraer ID del URL
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Si el último segmento es un número, es el ID
    if (/^\d+$/.test(lastPart)) {
      return lastPart;
    }
    
    // Si no, intentar extraer del response
    if (response) {
      const possibleIds = [
        'id',
        'producto_id',
        'cliente_id',
        'venta_id',
        'usuario_id',
        'proveedor_id',
        'gasto_id',
        'sesion_id',
        'cotizacion_id',
        'compra_id',
        'abono_id',
        'cuenta_id',
        'caja_id',
      ];
      
      for (const idField of possibleIds) {
        if (response[idField]) {
          return response[idField].toString();
        }
      }
    }
    
    return '';
  }

  private extractUserId(user: any): number | undefined {
    if (!user) return undefined;
    
    // Buscar userId en diferentes campos posibles
    return user.userId || user.usuario_id || user.sub || user.id;
  }

  private extractUserName(user: any): string | undefined {
    if (!user) return undefined;
    
    return user.nombre_usuario || user.nombre_completo || user.email || user.username;
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    
    // Remover campos sensibles
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'hash_contrasena', 'token', 'secret', 'contrasena'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}
