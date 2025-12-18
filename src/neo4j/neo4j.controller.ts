// src/neo4j/neo4j.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Neo4jService } from './neo4j.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Controller('neo4j')
@UseGuards(AuthGuard('jwt'))
export class Neo4jController {
  constructor(private readonly neo4jService: Neo4jService) {}

  // =========================================
  // NODOS
  // =========================================

  @Get('nodes')
  async getAllNodes() {
    return this.neo4jService.getAllNodes();
  }

  @Get('nodes/:id')
  async getNodeById(@Param('id') id: string) {
    const node = await this.neo4jService.getNodeById(id);
    if (!node) {
      throw new NotFoundException(`Nodo con ID ${id} no encontrado`);
    }
    return node;
  }

  @Post('nodes')
  async createNode(@Body() createNodeDto: CreateNodeDto) {
    const { label, nombre, descripcion, propiedades } = createNodeDto;
    return this.neo4jService.createNode(label, {
      nombre,
      descripcion,
      ...propiedades,
    });
  }

  @Put('nodes/:id')
  async updateNode(
    @Param('id') id: string,
    @Body() updateNodeDto: UpdateNodeDto,
  ) {
    const { nombre, descripcion, propiedades } = updateNodeDto;
    const node = await this.neo4jService.updateNode(id, {
      nombre,
      descripcion,
      ...propiedades,
    });
    if (!node) {
      throw new NotFoundException(`Nodo con ID ${id} no encontrado`);
    }
    return node;
  }

  @Delete('nodes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNode(@Param('id') id: string) {
    return this.neo4jService.deleteNode(id);
  }

  // =========================================
  // RELACIONES
  // =========================================

  @Get('relationships')
  async getAllRelationships() {
    return this.neo4jService.getAllRelationships();
  }

  @Post('relationships')
  async createRelationship(@Body() createRelDto: CreateRelationshipDto) {
    const { fromId, toId, type, propiedades } = createRelDto;
    const rel = await this.neo4jService.createRelationship(
      fromId,
      toId,
      type,
      propiedades,
    );
    if (!rel) {
      throw new NotFoundException('Uno o ambos nodos no existen');
    }
    return rel;
  }

  @Delete('relationships/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRelationship(@Param('id') id: string) {
    return this.neo4jService.deleteRelationship(id);
  }

  // =========================================
  // GRAFO COMPLETO
  // =========================================

  @Get('graph')
  async getFullGraph() {
    return this.neo4jService.getFullGraph();
  }
}
