import { Module } from '@nestjs/common';
import { MainCategoriesResolver } from './mainCategories.resolver';
import { MainCategoriesService } from './mainCategories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainCategory } from './entities/mainCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MainCategory])],
  providers: [MainCategoriesResolver, MainCategoriesService],
})
export class MainCategoriesModule {}
