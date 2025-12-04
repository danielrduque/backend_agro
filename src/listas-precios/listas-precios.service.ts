import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaPrecio } from './entities/lista-precio.entity';
import { CreateListaPrecioDto } from './dto/create-lista-precio.dto';

@Injectable()
export class ListasPreciosService {
  constructor(
    @InjectRepository(ListaPrecio)
    private readonly listaPrecioRepo: Repository<ListaPrecio>,
  ) {}

  async create(createDto: CreateListaPrecioDto): Promise<ListaPrecio> {
    const lista = this.listaPrecioRepo.create(createDto);
    return this.listaPrecioRepo.save(lista);
  }

  async findAll(): Promise<ListaPrecio[]> {
    return this.listaPrecioRepo.find();
  }

  async findOne(id: number): Promise<ListaPrecio> {
    const lista = await this.listaPrecioRepo.findOne({
      where: { lista_precio_id: id },
    });
    if (!lista) {
      throw new NotFoundException(`Lista de precios #${id} no encontrada.`);
    }
    return lista;
  }
}
