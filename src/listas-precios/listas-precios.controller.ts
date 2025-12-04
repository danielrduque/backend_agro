import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ListasPreciosService } from './listas-precios.service';
import { CreateListaPrecioDto } from './dto/create-lista-precio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('listas-precios')
@UseGuards(AuthGuard('jwt'))
export class ListasPreciosController {
  constructor(private readonly listasService: ListasPreciosService) {}

  @Post()
  create(@Body() createDto: CreateListaPrecioDto) {
    return this.listasService.create(createDto);
  }

  @Get()
  findAll() {
    return this.listasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listasService.findOne(id);
  }
}
