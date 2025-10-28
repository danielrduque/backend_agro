// src/productos/productos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  /**
   * @description Crea un nuevo producto en la base de datos.
   * @param createProductoDto Datos para crear el producto.
   * @returns El producto creado.
   */
  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(nuevoProducto);
  }

  /**
   * @description Obtiene todos los productos de la base de datos con sus relaciones.
   * @returns Un arreglo de productos.
   */
  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({
      relations: ['tipo_item', 'categoria', 'proveedor_preferido'],
    });
  }

  /**
   * @description Genera un reporte de productos que están por debajo del stock mínimo.
   * @returns Un arreglo de productos con bajo stock.
   */
  async findWithLowStock(): Promise<Producto[]> {
    return (
      this.productoRepository
        .createQueryBuilder('producto')
        .where('producto.stock_actual <= producto.stock_minimo')
        // Solo nos interesan los que tienen un stock mínimo configurado mayor a cero
        .andWhere('producto.stock_minimo > 0')
        .getMany()
    );
  }

  /**
   * @description Busca un producto por su ID.
   * @param id El ID del producto a buscar.
   * @returns El producto encontrado.
   * @throws NotFoundException si el producto no se encuentra.
   */
  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { producto_id: id },
      relations: ['tipo_item', 'categoria', 'proveedor_preferido'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID #${id} no encontrado.`);
    }
    return producto;
  }

  /**
   * @description Actualiza un producto existente.
   * @param id El ID del producto a actualizar.
   * @param updateProductoDto Los datos a actualizar.
   * @returns El producto actualizado.
   */
  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.productoRepository.preload({
      producto_id: id,
      ...updateProductoDto,
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID #${id} no encontrado.`);
    }

    return this.productoRepository.save(producto);
  }

  /**
   * @description Elimina un producto de la base de datos.
   * @param id El ID del producto a eliminar.
   */
  async remove(id: number): Promise<void> {
    const resultado = await this.productoRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Producto con ID #${id} no encontrado.`);
    }
  }
}
