import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caja])],
  controllers: [],
  providers: [],
})
export class CajasModule {}
