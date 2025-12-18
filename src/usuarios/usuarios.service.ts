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

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      relations: ['rol'],
      select: ['usuario_id', 'nombre_usuario', 'nombre_completo', 'activo'],
    });
  }

  /**
   * @description Crea un usuario desde autenticación con Google OAuth
   */
  async createGoogleUser(googleUserData: {
    nombre_usuario: string;
    nombre_completo: string;
    email: string;
    google_id: string;
  }): Promise<Usuario> {
    // Generar un hash de contraseña aleatorio para usuarios OAuth
    const salt = await bcrypt.genSalt();
    const randomPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    const nuevoUsuario = this.usuarioRepository.create({
      nombre_usuario: googleUserData.nombre_usuario,
      nombre_completo: googleUserData.nombre_completo,
      hash_contrasena: hashedPassword,
      activo: true,
    });

    return this.usuarioRepository.save(nuevoUsuario);
  }
}
