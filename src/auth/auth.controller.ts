// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Res,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
  async logout(@Headers('Authorization') authHeader: string): Promise<object> {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        await this.authService.logout(token);
      }
    }
    return {
      message: 'Sesión cerrada exitosamente, token añadido a blacklist',
    };
  }

  // =========================================
  // GOOGLE OAUTH 2.0
  // =========================================

  /**
   * @description Inicia el flujo de autenticación con Google
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Este método no hace nada; Passport redirige a Google
  }

  /**
   * @description Callback de Google OAuth. Crea/valida usuario y genera JWT
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      console.log('🔑 Google OAuth callback recibido');
      console.log('👤 Usuario de Google:', req.user);
      
      // req.user contiene los datos del perfil de Google
      const jwt = await this.authService.loginWithGoogle(req.user);
      console.log('✅ JWT generado:', jwt.access_token.substring(0, 20) + '...');
      
      // Redirigir al frontend con el token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${jwt.access_token}`;
      console.log('🔄 Redirigiendo a:', redirectUrl);
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Error en Google OAuth callback:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      res.redirect(`${frontendUrl}/auth/login?error=oauth_failed`);
    }
  }
}

