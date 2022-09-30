import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Food } from 'src/apis/foods/entities/food.entity';
import { Nutri } from 'src/apis/nutries/entities/nutri.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class FoodNutri {
  @PrimaryColumn()
  @Field(() => String)
  nutri_id: string;

  @PrimaryColumn()
  @Field(() => String)
  food_id: string;

  @ManyToOne((type) => Nutri, (nutri) => nutri.id)
  @Field(() => Nutri)
  @JoinColumn({ name: 'nutri_id' })
  public nutri!: Nutri;

  @ManyToOne((type) => Food, (food) => food.id)
  @Field(() => Food)
  @JoinColumn({ name: 'food_id' })
  public food!: Food;

  @Column()
  @Field(() => Int)
  weight: number;
}
