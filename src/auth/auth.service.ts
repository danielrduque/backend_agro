import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usuariosService.findOneByUsername(username);

    if (user && (await bcrypt.compare(pass, user.hash_contrasena))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash_contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.nombre_usuario, sub: user.usuario_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
