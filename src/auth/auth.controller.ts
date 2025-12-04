// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  UseGuards,
  Request,
  Headers, // 👈 Importamos Headers
  HttpCode, // 👈 Importamos HttpCode
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Nota: Passport-local espera un body con "username" y "password".
  // Asegúrate de que el cliente envíe esos campos.
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * @description Cierra la sesión del usuario añadiendo su JWT a la blacklist.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  // 1. CAMBIO: Quitamos @HttpCode(204)
  // 2. CAMBIO: Cambiamos el tipo de retorno a Promise<object>
  async logout(@Headers('Authorization') authHeader: string): Promise<object> {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        await this.authService.logout(token);
      }
    }
    // 3. CAMBIO: Devolvemos un mensaje JSON
    return {
      message: 'Sesión cerrada exitosamente, token añadido a blacklist',
    };
  }
}
