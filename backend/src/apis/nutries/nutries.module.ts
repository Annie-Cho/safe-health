import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nutri } from './entities/nutri.entity';
import { NutriesResolver } from './nutries.resolver';
import { NutriesService } from './nutries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nutri])],
  providers: [NutriesResolver, NutriesService],
})
export class NutriesModule {}
