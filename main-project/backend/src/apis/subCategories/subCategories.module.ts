import { Module } from '@nestjs/common';
import { SubCategory } from './entities/subCategory.entity';
import { SubCategoriesResolver } from './subCategories.resolver';
import { SubCategoriesService } from './subCategories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from '../foods/entities/food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory, Food])],
  providers: [SubCategoriesResolver, SubCategoriesService],
})
export class SubCategoriesModule {}
