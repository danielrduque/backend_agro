import {
  Injectable,
  Inject,
  UnauthorizedException, // 👈 Importamos UnauthorizedException
} from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.constants';

@Injectable()
export class AuthService {
  // --- NUEVAS CONSTANTES PARA LÍMITE DE INTENTOS ---
  private readonly MAX_LOGIN_ATTEMPTS = 5; // 5 intentos máximos
  private readonly LOGIN_BLOCK_DURATION = 40; // 40 segundos de bloqueo

  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private redisClient: Redis,
  ) {}

  /**
   * @description Valida las credenciales del usuario Y aplica el límite de intentos.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const attemptKey = `login-attempts:${username}`;

    // 1. Verificar si el usuario está bloqueado
    const attempts = await this.redisClient.get(attemptKey);
    if (attempts && Number(attempts) >= this.MAX_LOGIN_ATTEMPTS) {
      throw new UnauthorizedException(
        `Demasiados intentos fallidos. Intente de nuevo en ${this.LOGIN_BLOCK_DURATION} segundos.`,
      );
    }

    // 2. Intentar validar al usuario (como antes)
    const user = await this.usuariosService.findOneByUsername(username);

    // 3. Comparar la contraseña
    if (user && (await bcrypt.compare(pass, user.hash_contrasena))) {
      // 4. ÉXITO: Limpiar intentos y devolver usuario
      await this.redisClient.del(attemptKey);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash_contrasena, ...result } = user;
      return result;
    }

    // 5. FRACASO: Incrementar intentos y lanzar error
    // (Esto se ejecuta si el usuario no existe o la contraseña es incorrecta)
    const newAttempts = await this.redisClient.incr(attemptKey);

    // Si es el primer intento fallido, ponemos el contador de 40 seg
    if (newAttempts === 1) {
      await this.redisClient.expire(attemptKey, this.LOGIN_BLOCK_DURATION);
    }

    // Lanzar el error apropiado
    if (newAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      throw new UnauthorizedException(
        `Demasiados intentos fallidos. Intente de nuevo en ${this.LOGIN_BLOCK_DURATION} segundos.`,
      );
    } else {
      // Lanzamos este error en lugar de devolver null
      throw new UnauthorizedException('Credenciales incorrectas');
    }
  }

  async login(user: any) {
    const payload = { username: user.nombre_usuario, sub: user.usuario_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * @description Añade un token JWT a la blacklist de Redis.
   */
  async logout(token: string): Promise<void> {
    try {
      const payload = this.jwtService.decode(token) as { exp: number };
      if (!payload || !payload.exp) {
        return;
      }
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const remainingSeconds = payload.exp - nowInSeconds;

      if (remainingSeconds > 0) {
        await this.redisClient.set(
          `blacklist:${token}`,
          '1',
          'EX',
          remainingSeconds,
        );
      }
    } catch (error) {
      console.error('Error al añadir token a la blacklist:', error);
    }
  }
}
