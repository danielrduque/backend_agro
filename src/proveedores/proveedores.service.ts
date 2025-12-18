import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    try {
      if (createProveedorDto.nit) {
        const existing = await this.proveedoresRepository.findOneBy({ nit: createProveedorDto.nit });
        if (existing) {
          throw new ConflictException(`Ya existe un proveedor con el NIT ${createProveedorDto.nit}`);
        }
      }
      const proveedor = this.proveedoresRepository.create(createProveedorDto);
      return await this.proveedoresRepository.save(proveedor);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al crear el proveedor: ' + error.message);
    }
  }

  findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find();
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOneBy({ proveedor_id: id });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor with ID ${id} not found`);
    }
    return proveedor;
  }

  async update(id: number, updateProveedorDto: any): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    this.proveedoresRepository.merge(proveedor, updateProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedoresRepository.remove(proveedor);
  }
}
