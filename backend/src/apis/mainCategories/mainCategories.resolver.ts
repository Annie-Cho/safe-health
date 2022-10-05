import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateMainCategoryInput } from './dto/createMainCategory.input';
import { UpdateMainCategoryInput } from './dto/updateMainCategory.input';
import { MainCategory } from './entities/mainCategory.entity';
import { MainCategoriesService } from './mainCategories.service';

@Resolver()
export class MainCategoriesResolver {
  constructor(private readonly mainCategoriesService: MainCategoriesService) {}

  @Query(() => [MainCategory])
  fetchMainCategories() {
    return this.mainCategoriesService.findAll();
  }

  @Query(() => [MainCategory])
  fetchMainCategoriesWithDeleted() {
    return this.mainCategoriesService.findAllWithDeleted();
  }

  @Mutation(() => MainCategory)
  createMainCategory(
    @Args('createMainCategoryInput')
    createMainCategoryInput: CreateMainCategoryInput,
  ) {
    return this.mainCategoriesService.create({ createMainCategoryInput });
  }

  @Mutation(() => MainCategory)
  updateMainCategory(
    @Args('mainCategoryId') mainCategoryId: string,
    @Args('updateMainCategoryInput')
    updateMainCategoryInput: UpdateMainCategoryInput,
  ) {
    return this.mainCategoriesService.update({
      mainCategoryId,
      updateMainCategoryInput,
    });
  }

  @Mutation(() => Boolean)
  deleteMainCategory(@Args('mainCategoryId') mainCategoryId: string) {
    return this.mainCategoriesService.delete({ mainCategoryId });
  }

  @Mutation(() => Boolean)
  restoreMainCategory(@Args('mainCategoryId') mainCategoryId: string) {
    return this.mainCategoriesService.restore({ mainCategoryId });
  }
}
