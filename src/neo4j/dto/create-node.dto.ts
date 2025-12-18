// src/neo4j/dto/create-node.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @IsNotEmpty()
  label: string; // Tipo de nodo: Producto, Proveedor, Cliente, Categoria

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsObject()
  @IsOptional()
  propiedades?: Record<string, any>;
}
