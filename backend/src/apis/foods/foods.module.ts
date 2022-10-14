import { Module } from '@nestjs/common';
import { Food } from './entities/food.entity';
import { FoodsResolver } from './foods.resolver';
import { FoodsService } from './foods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { FoodImage } from '../foodImages/entities/foodImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Food, //
      FoodImage,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [FoodsResolver, FoodsService],
})
export class FoodsModule {}
