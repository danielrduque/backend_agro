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
    // Usamos una transacción para asegurar la integridad de los datos
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const compra = this.compraRepository.create(createCompraDto);
      compra.detalles = [];

      // Iteramos sobre los detalles para actualizar el stock de cada producto
      for (const detalleDto of createCompraDto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new NotFoundException(
            `El producto con ID #${detalleDto.producto_id} no fue encontrado.`,
          );
        }

        // --- ¡Lógica clave! Aumentamos el stock ---
        producto.stock_actual =
          Number(producto.stock_actual) + Number(detalleDto.cantidad);
        await queryRunner.manager.save(producto);

        const detalleCompra = queryRunner.manager.create(
          DetalleCompra,
          detalleDto,
        );
        detalleCompra.producto = producto;
        compra.detalles.push(detalleCompra);
      }

      const compraGuardada = await queryRunner.manager.save(compra);
      await queryRunner.commitTransaction();

      return this.findOne(compraGuardada.compra_id); // Devolvemos la compra completa
    } catch (error) {
      // Si algo falla, revertimos todos los cambios
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberamos el queryRunner
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
