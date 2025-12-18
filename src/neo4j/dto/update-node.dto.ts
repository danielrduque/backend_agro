// src/neo4j/dto/update-node.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateNodeDto } from './create-node.dto';

export class UpdateNodeDto extends PartialType(CreateNodeDto) {}
