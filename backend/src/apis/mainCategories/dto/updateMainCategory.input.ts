import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMainCategoryInput } from './createMainCategory.input';

@InputType()
export class UpdateMainCategoryInput extends PartialType(
  CreateMainCategoryInput,
) {}
