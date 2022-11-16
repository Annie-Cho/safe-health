import { CACHE_MANAGER, ConflictException, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { IesFood } from 'src/commons/type/esFood';
import { CreateFoodInput } from './dto/createFood.input';
import { UpdateFoodInput } from './dto/updateFood.input';
import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';

@Resolver()
export class FoodsResolver {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache, //

    private readonly elasticsearchService: ElasticsearchService,
    private readonly foodsService: FoodsService,
  ) {}

  @Query(() => [Food])
  async fetchFoods(@Args({ name: 'search', nullable: true }) search: string) {
    try {
      if (search) {
        //부분 검색
        //1. Redis에서 검색어 있는지 확인하기
        const redisResult = await this.cacheManager.get(search);
        if (redisResult) {
          return redisResult;
        }

        //2. Elasticsearch에서 검색어 있는지 확인하기
        const esSearchResult: IesFood = await this.elasticsearchService.search({
          index: 'foodlist',
          query: {
            match: {
              name: search,
            },
          },
        });

        //3. 검색된 데이터 Food 객체로 만들기
        const result = this.foodsService.makeItem({
          data: esSearchResult.hits.hits,
        });

        //4. Elasticsearch에서 조회한 결과 Redis에 저장하기
        const isSaved = await this.cacheManager.set(
          search, //
          result,
          {
            ttl: 3,
          },
        );

        return result;
      } else {
        //전체 검색
        const esResult: IesFood = await this.elasticsearchService.search({
          index: 'foodlist',
          query: {
            match_all: {},
          },
        });

        //검색된 데이터 Food 객체로 만들기
        const result = this.foodsService.makeItem({ data: esResult.hits.hits });
        return result;
      }
    } catch (error) {
      throw new ConflictException('검색에 실패하였습니다. ES를 확인해주세요.');
    }

    //MySQL에서 데이터 찾기
    // return this.foodsService.findAll();
  }

  @Query(() => [Food])
  fetchFoodsWithDeleted() {
    return this.foodsService.findAllWithDeleted();
  }

  @Query(() => Food)
  fetchFood(
    @Args('foodId') foodId: string, //
  ) {
    return this.foodsService.findOne({ foodId });
  }

  @Query(() => [Food])
  fetchNewFoods() {
    return this.foodsService.findNewestFoods();
  }

  @Mutation(() => Food)
  createFood(
    @Args('createFoodInput') createFoodInput: CreateFoodInput, //
  ) {
    return this.foodsService.create({ createFoodInput });
  }

  @Mutation(() => Food)
  async updateFood(
    @Args('foodId') foodId: string,
    @Args('updateFoodInput') updateFoodInput: UpdateFoodInput, //
  ) {
    // await this.foodService.checkSoldout({ foodId });

    return this.foodsService.update({ foodId, updateFoodInput });
  }

  @Mutation(() => Boolean)
  deleteFood(@Args('foodId') foodId: string) {
    return this.foodsService.delete({ foodId });
  }

  @Mutation(() => Boolean)
  restoreFood(@Args('foodId') foodId: string) {
    return this.foodsService.restore({ foodId });
  }
}
