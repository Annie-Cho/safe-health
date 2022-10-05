import { InputType, PartialType } from '@nestjs/graphql';
import { CreateFoodInput } from './createFood.input';

@InputType()
export class UpdateFoodInput extends PartialType(CreateFoodInput) {}
