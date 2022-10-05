import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SubCategory } from 'src/apis/subCategories/entities/subCategory.entity';
import { Image } from 'src/apis/images/entities/image.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from 'src/apis/payments/entities/payment.entity';

@Entity()
@ObjectType()
export class Food {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({ type: 'varchar', length: 500 })
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  kcal: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => SubCategory)
  @Field(() => SubCategory)
  subCategory: SubCategory;

  @ManyToMany(() => Payment, (payments) => payments.foods)
  @Field(() => [Payment])
  payments: Payment[];

  //For Image
  @OneToMany(() => Image, (image) => image.food)
  @Field(() => [Image])
  images: Image[];
}
