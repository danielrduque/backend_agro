import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caja } from './entities/caja.entity';

@Injectable()
export class CajasService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
  ) {}

  findAll() {
    return this.cajaRepository.find();
  }

  findOne(id: number) {
    return this.cajaRepository.findOneBy({ caja_id: id });
  }
}
