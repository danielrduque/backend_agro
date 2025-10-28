import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoItemDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
