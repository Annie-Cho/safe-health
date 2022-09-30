import { Field, ObjectType } from '@nestjs/graphql';
import { Food } from 'src/apis/foods/entities/food.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 200 })
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Food, (food) => food.images)
  @Field(() => Food)
  food: Food;
}
