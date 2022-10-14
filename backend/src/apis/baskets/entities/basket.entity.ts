import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Food } from 'src/apis/foods/entities/food.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Basket {
  @PrimaryColumn()
  @Field(() => String, { nullable: true })
  userId: string;

  @PrimaryColumn()
  @Field(() => String, { nullable: true })
  foodId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  public user!: User;

  @ManyToOne(() => Food, (food) => food.id)
  @JoinColumn({ name: 'foodId' })
  public food!: Food;

  @Column({ default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  number: number;
}
