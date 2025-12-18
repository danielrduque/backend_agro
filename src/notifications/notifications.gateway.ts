// src/notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

export interface SaleNotification {
  type: 'new-sale';
  message: string;
  data: {
    venta_id: number;
    total: number;
    cliente: string;
    fecha: Date;
  };
  timestamp: Date;
}

export interface StockNotification {
  type: 'low-stock';
  message: string;
  data: {
    producto_id: number;
    nombre: string;
    stock_actual: number;
    stock_minimo: number;
  };
  timestamp: Date;
}

export interface GeneralNotification {
  type: 'info' | 'warning' | 'success';
  message: string;
  timestamp: Date;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200', 'http://localhost:80'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');
  private connectedClients = new Map<string, any>();

  afterInit() {
    this.logger.log('🔌 WebSocket Gateway inicializado');
  }

  handleConnection(client: Socket) {
    const clientId = client.id;
    this.connectedClients.set(clientId, {
      id: clientId,
      connectedAt: new Date(),
    });
    this.logger.log(`✅ Cliente conectado: ${clientId} (Total: ${this.connectedClients.size})`);

    // Enviar mensaje de bienvenida
    client.emit('connected', {
      message: 'Conectado al servidor de notificaciones',
      clientId: clientId,
      timestamp: new Date(),
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`❌ Cliente desconectado: ${client.id} (Total: ${this.connectedClients.size})`);
  }

  /**
   * Notifica a todos los clientes sobre una nueva venta
   */
  notifyNewSale(venta: any) {
    const notification: SaleNotification = {
      type: 'new-sale',
      message: `💰 Nueva venta #${venta.venta_id} por $${Number(venta.total).toLocaleString('es-CO')}`,
      data: {
        venta_id: venta.venta_id,
        total: venta.total,
        cliente: venta.cliente?.nombre_completo || 'Cliente General',
        fecha: new Date(),
      },
      timestamp: new Date(),
    };

    this.server.emit('new-sale', notification);
    this.logger.log(`📢 Notificación de venta enviada: #${venta.venta_id}`);
  }

  /**
   * Notifica sobre stock bajo de un producto
   */
  notifyLowStock(producto: any) {
    const notification: StockNotification = {
      type: 'low-stock',
      message: `⚠️ Stock bajo: ${producto.nombre} (${producto.stock_actual} unidades)`,
      data: {
        producto_id: producto.producto_id,
        nombre: producto.nombre,
        stock_actual: producto.stock_actual,
        stock_minimo: producto.stock_minimo || 5,
      },
      timestamp: new Date(),
    };

    this.server.emit('low-stock', notification);
    this.logger.warn(`📢 Alerta de stock bajo: ${producto.nombre}`);
  }

  /**
   * Envía una notificación general
   */
  notifyGeneral(type: 'info' | 'warning' | 'success', message: string) {
    const notification: GeneralNotification = {
      type,
      message,
      timestamp: new Date(),
    };

    this.server.emit('notification', notification);
    this.logger.log(`📢 Notificación general: ${message}`);
  }

  /**
   * Notifica sobre un nuevo cliente registrado
   */
  notifyNewClient(cliente: any) {
    this.server.emit('notification', {
      type: 'success',
      message: `👤 Nuevo cliente: ${cliente.nombre_completo}`,
      data: cliente,
      timestamp: new Date(),
    });
    this.logger.log(`📢 Nuevo cliente: ${cliente.nombre_completo}`);
  }

  /**
   * Notifica sobre un nuevo producto creado
   */
  notifyNewProduct(producto: any) {
    this.server.emit('notification', {
      type: 'info',
      message: `📦 Nuevo producto: ${producto.nombre}`,
      data: producto,
      timestamp: new Date(),
    });
    this.logger.log(`📢 Nuevo producto: ${producto.nombre}`);
  }

  /**
   * Notifica sobre apertura de sesión de caja
   */
  notifySessionOpened(sesion: any, usuario: string) {
    this.server.emit('notification', {
      type: 'success',
      message: `🟢 Caja abierta por ${usuario} - Base: $${Number(sesion.monto_inicial || 0).toLocaleString('es-CO')}`,
      data: sesion,
      timestamp: new Date(),
    });
    this.logger.log(`📢 Sesión de caja abierta por ${usuario}`);
  }

  /**
   * Notifica sobre cierre de sesión de caja
   */
  notifySessionClosed(sesion: any, usuario: string) {
    this.server.emit('notification', {
      type: 'warning',
      message: `🔴 Caja cerrada por ${usuario} - Total: $${Number(sesion.monto_final || 0).toLocaleString('es-CO')}`,
      data: sesion,
      timestamp: new Date(),
    });
    this.logger.log(`📢 Sesión de caja cerrada por ${usuario}`);
  }

  /**
   * Notifica sobre un pago/abono recibido
   */
  notifyPaymentReceived(abono: any) {
    this.server.emit('notification', {
      type: 'success',
      message: `💵 Pago recibido: $${Number(abono.monto || 0).toLocaleString('es-CO')} de ${abono.cliente?.nombre_completo || 'Cliente'}`,
      data: abono,
      timestamp: new Date(),
    });
    this.logger.log(`📢 Pago recibido: $${abono.monto}`);
  }

  /**
   * Notifica sobre un gasto registrado
   */
  notifyExpenseCreated(gasto: any) {
    this.server.emit('notification', {
      type: 'warning',
      message: `💸 Gasto registrado: $${Number(gasto.monto || 0).toLocaleString('es-CO')} - ${gasto.descripcion || 'Sin descripción'}`,
      data: gasto,
      timestamp: new Date(),
    });
    this.logger.log(`📢 Gasto registrado: $${gasto.monto}`);
  }

  /**
   * Envía una notificación de prueba (para testing)
   */
  sendTestNotification() {
    const types = ['info', 'success', 'warning'] as const;
    const messages = [
      '🎉 ¡Bienvenido al sistema de notificaciones!',
      '📊 Las ventas de hoy van excelente',
      '⏰ Recuerda cerrar la caja al final del día',
      '✅ El inventario ha sido actualizado',
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    this.notifyGeneral(type, message);
  }

  /**
   * Obtiene la cantidad de clientes conectados
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}
