import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSubCategory } from './dto/createSubCategory.input';
import { UpdateSubCategory } from './dto/updateSubCategory.input';
import { SubCategory } from './entities/subCategory.entity';
import { SubCategoriesService } from './subCategories.service';

@Resolver()
export class SubCategoriesResolver {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Query(() => [SubCategory])
  fetchSubCategories() {
    return this.subCategoriesService.findAll();
  }

  @Mutation(() => SubCategory)
  createSubCategory(
    @Args('createSubCategory') createSubCategory: CreateSubCategory, //
  ) {
    return this.subCategoriesService.create({ createSubCategory });
  }

  @Mutation(() => SubCategory)
  updateSubCategory(
    @Args('subCategoryId') subCategoryId: string,
    @Args('updateSubCategory') updateSubCategory: UpdateSubCategory,
  ) {
    return this.subCategoriesService.update({
      subCategoryId,
      updateSubCategory,
    });
  }

  @Mutation(() => Boolean)
  deleteSubCategory(@Args('subCategoryId') subCategoryId: string) {
    return this.subCategoriesService.delete({ subCategoryId });
  }

  @Mutation(() => Boolean)
  restoreSubCategory(@Args('subCategoryId') subCategoryId: string) {
    return this.subCategoriesService.restore({ subCategoryId });
  }
}
