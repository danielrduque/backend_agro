import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PreciosProductoService } from './precios-producto.service';
import { CreatePrecioProductoDto } from './dto/create-precio-producto.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('precios-producto')
@UseGuards(AuthGuard('jwt'))
export class PreciosProductoController {
  constructor(private readonly preciosService: PreciosProductoService) {}

  @Post()
  createOrUpdate(@Body() createDto: CreatePrecioProductoDto) {
    return this.preciosService.createOrUpdate(createDto);
  }

  @Get('producto/:id')
  findByProducto(@Param('id', ParseIntPipe) id: number) {
    return this.preciosService.findAllByProducto(id);
  }

  // Endpoint útil para el frontend al momento de vender:
  // GET /precios-producto/check?productoId=1&listaId=2
  @Get('check')
  checkPrecio(
    @Query('productoId', ParseIntPipe) productoId: number,
    @Query('listaId', ParseIntPipe) listaId: number,
  ) {
    return this.preciosService.findPrecio(productoId, listaId);
  }
}
