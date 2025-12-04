// src/compras/compras.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { Producto } from '../productos/entities/producto.entity';
import { DetalleCompra } from '../detalle-compras/entities/detalle-compra.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * @description Crea un registro de compra y actualiza el stock de productos.
   * @param createCompraDto Los datos para la nueva compra.
   * @returns La compra creada con sus detalles.
   */
  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    // Usamos una transacción (QueryRunner) para asegurar que la actualización
    // del stock y la creación de la compra sean una sola operación (atómica).
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // <-- "Modo 'Todo o Nada' activado"

    try {
      const compra = this.compraRepository.create(createCompraDto);
      compra.detalles = [];

      // Iteramos sobre los detalles para actualizar el stock de cada producto
      for (const detalleDto of createCompraDto.detalles) {
        // Buscamos el producto usando el "controlador" de la transacción
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `El producto con ID #${detalleDto.producto_id} no fue encontrado.`,
          );
        }

        // --- ¡AQUÍ SE MANEJA LA CONCURRENCIA! ---
        // Esta es la lógica clave: Aumentamos el stock.
        producto.stock_actual =
          Number(producto.stock_actual) + Number(detalleDto.cantidad);

        // *EXPLICACIÓN DE CONCURRENCIA*:
        // Al igual que en Ventas, esta línea PONE EN ESPERA (bloquea)
        // a cualquier otra persona (como un vendedor) que intente
        // modificar ESTE MISMO producto.
        // Así evitamos que una venta lea un stock "viejo"
        // mientras la compra aún no se ha confirmado.
        await queryRunner.manager.save(producto);

        // (Preparamos el detalle de la compra para guardarlo)
        const detalleCompra = queryRunner.manager.create(
          DetalleCompra,
          detalleDto,
        );
        detalleCompra.producto = producto;
        compra.detalles.push(detalleCompra);
      }

      // Guardamos la compra principal (aún "en borrador" dentro de la tx)
      const compraGuardada = await queryRunner.manager.save(compra);

      // --- ¡ÉXITO! ---
      // Si todo salió bien, "confirmamos" todos los cambios.
      // El nuevo stock de los productos ahora es visible para todos.
      await queryRunner.commitTransaction();

      return this.findOne(compraGuardada.compra_id); // Devolvemos la compra completa
    } catch (error) {
      // --- ¡FALLO! ---
      // Si algo falló (ej. el producto no existía), revertimos TODO.
      // El stock nunca se aumentó y la compra no se creó.
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Siempre liberamos el controlador al final.
      await queryRunner.release();
    }
  }

  /**
   * @description Obtiene todas las compras con sus relaciones.
   * @returns Un arreglo de compras.
   */
  async findAll(): Promise<Compra[]> {
    return this.compraRepository.find({
      relations: [
        'proveedor',
        'usuario',
        'metodo_pago',
        'detalles',
        'detalles.producto',
      ],
    });
  }

  /**
   * @description Busca una compra por su ID.
   * @param id El ID de la compra.
   * @returns La compra encontrada.
   */
  async findOne(id: number): Promise<Compra> {
    const compra = await this.compraRepository.findOne({
      where: { compra_id: id },
      relations: [
        'proveedor',
        'usuario',
        'metodo_pago',
        'detalles',
        'detalles.producto',
      ],
    });

    if (!compra) {
      throw new NotFoundException(`La compra con ID #${id} no fue encontrada.`);
    }
    return compra;
  }
}
