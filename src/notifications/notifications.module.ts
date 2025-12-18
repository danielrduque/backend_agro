// src/notifications/notifications.module.ts
import { Module, Global } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Global() // Hacer el gateway disponible globalmente
@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
