import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nutri } from './entities/nutri.entity';

@Injectable()
export class NutriesService {
  constructor(
    @InjectRepository(Nutri)
    private readonly nutriRepository: Repository<Nutri>,
  ) {}

  findAll() {
    return this.nutriRepository.find();
  }

  create({ nutriName }) {
    return this.nutriRepository.save({ name: nutriName });
  }
}
