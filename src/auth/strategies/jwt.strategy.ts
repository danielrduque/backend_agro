// src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  Inject,
  UnauthorizedException, // 👈 Importamos UnauthorizedException
} from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Redis } from 'ioredis'; // 👈 Importamos el tipo Redis
import { REDIS_CLIENT } from '../../redis/redis.constants'; // 👈 Importamos nuestro token (ajusta la ruta)
import { Request } from 'express'; // 👈 Importamos el tipo Request

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(REDIS_CLIENT) private redisClient: Redis, // 👈 Inyectamos ioredis
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true, // 👈 ¡CLAVE! Pasa el objeto Request al 'validate'
    });
  }

  /**
   * @description Valida el token JWT.
   * Ahora también revisa si el token está en la blacklist de Redis.
   * @param req El objeto Request (gracias a 'passReqToCallback: true')
   * @param payload El payload decodificado del JWT
   */
  async validate(req: Request, payload: any) {
    // 1. Extraemos el token crudo (string) del header
    // Usamos la misma función que usa passport por defecto
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new UnauthorizedException('No se encontró el token');
    }

    // 2. Consultamos Redis para ver si el token está en la blacklist
    const isBlacklisted = await this.redisClient.get(`blacklist:${token}`);

    // 3. Si 'get' devuelve algo (en nuestro caso, '1'), el token es inválido
    if (isBlacklisted) {
      throw new UnauthorizedException(
        'El token está en la lista negra (sesión cerrada)',
      );
    }

    // 4. Si no está en la blacklist, la sesión es válida
    return { usuario_id: payload.sub, nombre_usuario: payload.username };
  }
}
