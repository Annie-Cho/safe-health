import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSubCategory } from './createSubCategory.input';

@InputType()
export class UpdateSubCategory extends PartialType(CreateSubCategory) {}
