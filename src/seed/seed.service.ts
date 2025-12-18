// src/seed/seed.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ClientesService } from '../clientes/clientes.service';
import { ProductosService } from '../productos/productos.service';
import { ProveedoresService } from '../proveedores/proveedores.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly usuariosService: UsuariosService,
    private readonly clientesService: ClientesService,
    private readonly productosService: ProductosService,
    private readonly proveedoresService: ProveedoresService,
  ) {}

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

      // 7. Categorías de Gasto
      await queryRunner.query(`
        INSERT INTO categorias_gasto (categoria_gasto_id, nombre) VALUES 
        (1, 'General'),
        (2, 'Servicios Públicos'),
        (3, 'Compras/Inventario'),
        (4, 'Mantenimiento'),
        (5, 'Salarios'),
        (6, 'Otros')
        ON CONFLICT (categoria_gasto_id) DO NOTHING;
      `);

      // Ajustar secuencia de categorias_gasto
      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('categorias_gasto', 'categoria_gasto_id'), COALESCE(MAX(categoria_gasto_id)+1, 1), false) FROM categorias_gasto;
      `);

      // 8. Categorías de Producto
      await queryRunner.query(`
        INSERT INTO categorias_producto (categoria_id, nombre) VALUES 
        (1, 'Fertilizantes'),
        (2, 'Semillas'),
        (3, 'Agroquímicos'),
        (4, 'Herramientas'),
        (5, 'Suplementos Animales'),
        (6, 'Alimentos para Animales'),
        (7, 'Material de Riego'),
        (8, 'Otros')
        ON CONFLICT (categoria_id) DO NOTHING;
      `);

      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('categorias_producto', 'categoria_id'), COALESCE(MAX(categoria_id)+1, 1), false) FROM categorias_producto;
      `);

      // 9. Tipos de Ítem
      await queryRunner.query(`
        INSERT INTO tipos_item (id, nombre) VALUES 
        (1, 'Producto'),
        (2, 'Servicio'),
        (3, 'Insumo')
        ON CONFLICT (id) DO NOTHING;
      `);

      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('tipos_item', 'id'), COALESCE(MAX(id)+1, 1), false) FROM tipos_item;
      `);

      // 10. Roles
      await queryRunner.query(`
        INSERT INTO roles (id, nombre) VALUES 
        (1, 'Admin'),
        (2, 'Vendedor'),
        (3, 'Cajero')
        ON CONFLICT (id) DO NOTHING;
      `);

      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE(MAX(id)+1, 1), false) FROM roles;
      `);

      // 11. Listas de Precios
      await queryRunner.query(`
        INSERT INTO listas_precios (lista_precio_id, nombre) VALUES 
        (1, 'Lista General (Normal)'),
        (2, 'Lista Mayorista')
        ON CONFLICT (lista_precio_id) DO NOTHING;
      `);

      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('listas_precios', 'lista_precio_id'), COALESCE(MAX(lista_precio_id)+1, 1), false) FROM listas_precios;
      `);

      // 12. Cajas
      await queryRunner.query(`
        INSERT INTO cajas (caja_id, nombre, ubicacion) VALUES 
        (1, 'Caja Principal', 'Local Principal')
        ON CONFLICT (caja_id) DO NOTHING;
      `);

      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('cajas', 'caja_id'), COALESCE(MAX(caja_id)+1, 1), false) FROM cajas;
      `);

      // 13. Usuarios por defecto (¡CRÍTICO PARA LOGIN!)
      // Si no hay usuarios, creamos los por defecto usando UsuariosService
      const usersCount = await this.usuariosService.findAll();
      if (usersCount.length === 0) {
        this.logger.log('🌱 No se encontraron usuarios. Creando usuarios por defecto...');

        // Admin
        await this.usuariosService.create({
          nombre_usuario: 'admin',
          hash_contrasena: 'admin123',
          nombre_completo: 'Administrador del Sistema',
          rol_id: 1, // Admin
          activo: true,
        });

        // Vendedor
        await this.usuariosService.create({
          nombre_usuario: 'vendedor1',
          hash_contrasena: 'password',
          nombre_completo: 'Vendedor Principal',
          rol_id: 2, // Vendedor
          activo: true,
        });
        
        this.logger.log('✅ Usuarios por defecto creados: admin/admin123 y vendedor1/password');
      } else {
        this.logger.log('ℹ️ Ya existen usuarios en la base de datos. Saltando creación.');
      }

      // ===========================================
      // DATOS DE PRUEBA (Proveedores, Clientes, Productos)
      // ===========================================
      
      // 14. Proveedores de prueba
      const proveedores = await this.proveedoresService.findAll();
      if (proveedores.length === 0) {
        this.logger.log('🌱 Creando proveedores de prueba...');
        
        await this.proveedoresService.create({
          nombre: 'AgroGlobal S.A.',
          contacto_principal: 'Carlos Rodríguez',
          telefono: '3001234567',
          email: 'contacto@agroglobal.com',
          direccion: 'Zona Franca Bogotá',
          nit: '900111222-1'
        });

        await this.proveedoresService.create({
          nombre: 'FertiDum Ltda.',
          contacto_principal: 'Maria González',
          telefono: '3109876543',
          email: 'ventas@fertidum.com',
          direccion: 'Km 5 Vía al Llano',
          nit: '800333444-5'
        });

        await this.proveedoresService.create({
          nombre: 'Semillas del Valle',
          contacto_principal: 'Pedro Perez',
          telefono: '3205551234',
          email: 'info@semillasvalle.com',
          direccion: 'Cali, Valle del Cauca',
          nit: '890555666-8'
        });
        
        this.logger.log('✅ 3 Proveedores creados');
      }

      // 15. Clientes de prueba
      const clientes = await this.clientesService.findAll();
      if (clientes.length === 0) {
        this.logger.log('🌱 Creando clientes de prueba...');
        
        await this.clientesService.create({
          nombre_completo: 'Juan Pueblo',
          tipo_documento_id: 1, // CC
          numero_documento: '1010101010',
          telefono: '3001112233',
          email: 'juan.pueblo@email.com',
          direccion: 'Vereda El Hato',
        });

        await this.clientesService.create({
          nombre_completo: 'Finca La Esperanza',
          tipo_documento_id: 2, // NIT
          numero_documento: '900123456-1',
          telefono: '3102223344',
          email: 'admin@laesperanza.com',
          direccion: 'Km 12 Vía Principal',
        });

        await this.clientesService.create({
          nombre_completo: 'Maria Campesina',
          tipo_documento_id: 1, // CC
          numero_documento: '52525252',
          telefono: '3203334455',
          direccion: 'Sector La Playa',
        });
        
        this.logger.log('✅ 3 Clientes creados');
      }

      // 16. Productos de prueba
      const productos = await this.productosService.findAll();
      if (productos.length === 0) {
        this.logger.log('🌱 Creando productos de prueba...');

        // Fertilizantes (Cat 1)
        await this.productosService.create({
          nombre: 'Triple 15 - Bulto 50kg',
          descripcion: 'Fertilizante compuesto NPK 15-15-15',
          codigo_barras: 'FERT-001',
          precio_costo_unitario: 150000,
          precio_venta: 185000,
          stock_actual: 100,
          stock_minimo: 20,
          categoria_id: 1,
          tipo_item_id: 1, // Producto
          proveedor_id_preferido: 1, // AgroGlobal
          unidad_medida: 'Bulto',
        });

        await this.productosService.create({
          nombre: 'Urea Agrícola - Bulto 50kg',
          descripcion: 'Nitrógeno 46%',
          codigo_barras: 'FERT-002',
          precio_costo_unitario: 120000,
          precio_venta: 145000,
          stock_actual: 50,
          stock_minimo: 10,
          categoria_id: 1,
          tipo_item_id: 1,
          proveedor_id_preferido: 2, // FertiDum
          unidad_medida: 'Bulto',
        });

        // Semillas (Cat 2)
        await this.productosService.create({
          nombre: 'Semilla Maíz Híbrido - Bolsa 60k',
          descripcion: 'Maíz amarillo de alto rendimiento',
          codigo_barras: 'SEM-001',
          precio_costo_unitario: 450000,
          precio_venta: 520000,
          stock_actual: 30,
          stock_minimo: 5,
          categoria_id: 2,
          tipo_item_id: 1,
          proveedor_id_preferido: 3, // Semillas del Valle
          unidad_medida: 'Bolsa',
        });

        // Herramientas (Cat 4)
        await this.productosService.create({
          nombre: 'Machete 22 Pulgadas',
          descripcion: 'Acero templado con funda',
          codigo_barras: 'HERR-001',
          precio_costo_unitario: 15000,
          precio_venta: 25000,
          stock_actual: 25,
          stock_minimo: 5,
          categoria_id: 4,
          tipo_item_id: 1,
          proveedor_id_preferido: 1,
          unidad_medida: 'Unidad',
        });

        await this.productosService.create({
          nombre: 'Bomba de Espalda 20L',
          descripcion: 'Manual, presión constante',
          codigo_barras: 'HERR-002',
          precio_costo_unitario: 180000,
          precio_venta: 240000,
          stock_actual: 10,
          stock_minimo: 2,
          categoria_id: 4,
          tipo_item_id: 1,
          proveedor_id_preferido: 1,
          unidad_medida: 'Unidad',
        });

        // Alimentos (Cat 6)
        await this.productosService.create({
          nombre: 'Concentrado Pollo Engorde - 40kg',
          descripcion: 'Etapa final',
          codigo_barras: 'ALIM-001',
          precio_costo_unitario: 95000,
          precio_venta: 115000,
          stock_actual: 200,
          stock_minimo: 40,
          categoria_id: 6,
          tipo_item_id: 1,
          proveedor_id_preferido: 2,
          unidad_medida: 'Bulto',
        });

        this.logger.log('✅ 6 Productos creados');
      } else {
        this.logger.log('ℹ️ Ya existen productos. Saltando creación.');
      }

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
