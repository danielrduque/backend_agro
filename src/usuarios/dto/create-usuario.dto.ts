import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

  @IsString()
  @IsNotEmpty()
  hash_contrasena: string;

  @IsOptional()
  @IsString()
  nombre_completo?: string;

  @IsInt()
  rol_id: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
