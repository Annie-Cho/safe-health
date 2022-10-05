import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubCategory {
  @Field(() => String)
  name: string;

  @Field(() => String)
  mainCategoryId: string;
}
