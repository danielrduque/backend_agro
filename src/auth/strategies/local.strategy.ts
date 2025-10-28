// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 👇 **¡ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ ASÍ!**
    // Esto le dice a Passport que el campo de usuario se llama "nombre_usuario" en el body.
    super({ usernameField: 'nombre_usuario' });
  }

  // Y que el método validate también use 'nombre_usuario'
  async validate(nombre_usuario: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(nombre_usuario, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return user;
  }
}
