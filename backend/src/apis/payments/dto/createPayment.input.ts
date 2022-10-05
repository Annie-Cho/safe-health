import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  impUid: string;

  @Field(() => Int)
  amount: number;

  //ManyToMany
  @Field(() => [String])
  foodIds: string[];
}
