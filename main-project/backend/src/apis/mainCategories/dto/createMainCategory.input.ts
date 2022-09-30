import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMainCategoryInput {
  @Field(() => String)
  name: string;
}
