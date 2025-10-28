import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      createUsuarioDto.hash_contrasena,
      salt,
    );

    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      hash_contrasena: hashedPassword,
    });

    return this.usuarioRepository.save(nuevoUsuario);
  }

  async findOneByUsername(nombre_usuario: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { nombre_usuario } });
  }

  // Puedes añadir más métodos aquí si los necesitas (findAll, findOne, etc.)
}
