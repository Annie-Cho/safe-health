import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ImageInput {
  @Field(() => String)
  url: string;

  // @Field(() => Boolean)
  // isMain: boolean;
}
