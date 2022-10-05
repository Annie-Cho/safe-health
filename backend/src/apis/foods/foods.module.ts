import { Module } from '@nestjs/common';
import { Food } from './entities/food.entity';
import { FoodsResolver } from './foods.resolver';
import { FoodsService } from './foods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Food, //
      Image,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [FoodsResolver, FoodsService],
})
export class FoodsModule {}
