import { Field, ObjectType } from '@nestjs/graphql';
import { Food } from 'src/apis/foods/entities/food.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class LikedList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Food)
  @Field(() => Food)
  food: Food;
}
