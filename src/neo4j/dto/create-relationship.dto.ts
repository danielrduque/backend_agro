// src/neo4j/dto/create-relationship.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateRelationshipDto {
  @IsString()
  @IsNotEmpty()
  fromId: string; // ID del nodo origen

  @IsString()
  @IsNotEmpty()
  toId: string; // ID del nodo destino

  @IsString()
  @IsNotEmpty()
  type: string; // Tipo de relación: PROVEE, COMPRA, PERTENECE_A, etc.

  @IsObject()
  @IsOptional()
  propiedades?: Record<string, any>;
}
