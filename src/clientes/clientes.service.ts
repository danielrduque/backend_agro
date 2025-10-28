// src/clientes/clientes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  /**
   * @description Crea un nuevo cliente.
   * @param createClienteDto Datos para el nuevo cliente.
   * @returns El cliente recién creado.
   */
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  /**
   * @description Obtiene una lista de todos los clientes.
   * @returns Un arreglo de clientes.
   */
  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  /**
   * @description Busca un cliente específico por su ID.
   * @param id El ID del cliente a buscar.
   * @returns El cliente encontrado.
   * @throws NotFoundException si no se encuentra el cliente.
   */
  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ cliente_id: id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID #${id} no encontrado.`);
    }
    return cliente;
  }

  /**
   * @description Actualiza los datos de un cliente existente.
   * @param id El ID del cliente a actualizar.
   * @param updateClienteDto Los datos a modificar.
   * @returns El cliente con los datos actualizados.
   */
  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.clienteRepository.preload({
      cliente_id: id,
      ...updateClienteDto,
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID #${id} no encontrado.`);
    }
    return this.clienteRepository.save(cliente);
  }

  /**
   * @description Elimina un cliente por su ID.
   * @param id El ID del cliente a eliminar.
   */
  async remove(id: number): Promise<void> {
    const resultado = await this.clienteRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Cliente con ID #${id} no encontrado.`);
    }
  }
}
