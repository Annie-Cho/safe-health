import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ImageInput } from 'src/apis/images/dto/Image.input';

@InputType()
export class CreateFoodInput {
  @Field(() => String)
  name: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => String)
  description: string;

  @Min(0)
  @Field(() => Int)
  kcal: number;

  //ManyToOne
  @Field(() => String)
  subCategoryId: string;

  //Getting Images Data
  @Field(() => [ImageInput])
  images: ImageInput[];
}
