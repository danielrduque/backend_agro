import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CajasService } from './cajas.service';

@Controller('cajas')
export class CajasController {
  constructor(private readonly cajasService: CajasService) {}

  @Get()
  findAll() {
    return this.cajasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cajasService.findOne(id);
  }
}
