// src/seed/seed.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async runSeeds() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Estados de Cotización
      await this.insertarSiNoExiste(queryRunner, 'cotizaciones_estados', [
        { id: 1, nombre: 'Pendiente' },
        { id: 2, nombre: 'Aprobada' },
        { id: 3, nombre: 'Rechazada' },
        { id: 4, nombre: 'Facturada' },
      ]);

      // 2. Tipos de Documento
      await this.insertarSiNoExiste(queryRunner, 'tipos_documento', [
        { id: 1, nombre: 'Cédula de Ciudadanía' },
        { id: 2, nombre: 'NIT' },
        { id: 3, nombre: 'Pasaporte' },
      ]);

      // 3. Estados de Venta
      await this.insertarSiNoExiste(queryRunner, 'ventas_estados', [
        { id: 1, nombre: 'pagada' },
        { id: 2, nombre: 'pendiente de pago' },
        { id: 3, nombre: 'anulada' },
      ]);

      // 4. Estados de Sesión de Caja
      await this.insertarSiNoExiste(queryRunner, 'sesiones_caja_estados', [
        { id: 1, nombre: 'abierta' },
        { id: 2, nombre: 'cerrada' },
      ]);

      // 5. Estados de Cuenta (Cobrar/Pagar)
      await this.insertarSiNoExiste(queryRunner, 'cuentas_estados', [
        { id: 1, nombre: 'pagada' },
        { id: 2, nombre: 'pendiente de pago' },
        { id: 3, nombre: 'vencida' },
        { id: 4, nombre: 'anulada' },
      ]);

      // 6. Métodos de Pago
      // Nota: Verifica si tu tabla tiene la columna 'es_efectivo'
      await queryRunner.query(`
        INSERT INTO metodos_pago (id, nombre, es_efectivo) VALUES 
        (1, 'Efectivo', true),
        (2, 'Transferencia', false),
        (3, 'Tarjeta de Crédito', false)
        ON CONFLICT (id) DO NOTHING;
      `);

      await queryRunner.commitTransaction();
      return '¡Semillas ejecutadas correctamente! Base de datos poblada.';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new InternalServerErrorException(
        'Error ejecutando semillas',
        error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // Función auxiliar para insertar datos evitando duplicados
  private async insertarSiNoExiste(
    queryRunner: any,
    tabla: string,
    datos: any[],
  ) {
    for (const dato of datos) {
      // Usamos SQL puro para forzar los IDs específicos que necesitamos
      await queryRunner.query(`
        INSERT INTO ${tabla} (id, nombre) 
        VALUES (${dato.id}, '${dato.nombre}') 
        ON CONFLICT (id) DO NOTHING;
      `);

      // Ajustar la secuencia para que el auto-incremento no falle después
      // Esto le dice a Postgres: "El siguiente ID debe ser el máximo + 1"
      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('${tabla}', 'id'), COALESCE(MAX(id)+1, 1), false) FROM ${tabla};
      `);
    }
  }
}
