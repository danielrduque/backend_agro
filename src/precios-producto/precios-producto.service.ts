import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrecioProducto } from './entities/precio-producto.entity';
import { CreatePrecioProductoDto } from './dto/create-precio-producto.dto';

@Injectable()
export class PreciosProductoService {
  constructor(
    @InjectRepository(PrecioProducto)
    private readonly precioRepo: Repository<PrecioProducto>,
  ) {}

  // Crear o Actualizar precio (Upsert)
  async createOrUpdate(
    createDto: CreatePrecioProductoDto,
  ): Promise<PrecioProducto> {
    // Buscamos si ya existe precio para este producto en esta lista
    const existente = await this.precioRepo.findOne({
      where: {
        producto_id: createDto.producto_id,
        lista_precio_id: createDto.lista_precio_id,
      },
    });

    if (existente) {
      existente.precio_venta = createDto.precio_venta;
      return this.precioRepo.save(existente);
    } else {
      const nuevo = this.precioRepo.create(createDto);
      return this.precioRepo.save(nuevo);
    }
  }

  // Obtener precios de un producto
  async findAllByProducto(productoId: number): Promise<PrecioProducto[]> {
    return this.precioRepo.find({
      where: { producto_id: productoId },
      relations: ['lista_precio'],
    });
  }

  // Buscar precio específico (para usar en ventas)
  async findPrecio(
    productoId: number,
    listaId: number,
  ): Promise<PrecioProducto> {
    const precio = await this.precioRepo.findOne({
      where: { producto_id: productoId, lista_precio_id: listaId },
    });

    if (!precio) {
      throw new NotFoundException(
        `No hay precio definido para el producto #${productoId} en la lista #${listaId}`,
      );
    }
    return precio;
  }
}
