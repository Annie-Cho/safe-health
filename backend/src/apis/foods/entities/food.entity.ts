import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { SubCategory } from 'src/apis/subCategories/entities/subCategory.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FoodImage } from 'src/apis/foodImages/entities/foodImage.entity';
import { Order } from 'src/apis/orders/entities/order.entity';

@Entity()
@ObjectType()
export class Food {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  brandName: string;

  @Column()
  @Field(() => Int, { nullable: true })
  price: number;

  @Column({ type: 'varchar', length: 500 })
  @Field(() => String, { nullable: true })
  description: string;

  @Column()
  @Field(() => Int, { nullable: true })
  stock: number;

  @Column({ type: 'float', default: 0 })
  @Field(() => Float, { nullable: true })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => SubCategory)
  @Field(() => SubCategory)
  subCategory: SubCategory;

  //For Image
  @OneToMany(() => FoodImage, (image) => image.food)
  @Field(() => [FoodImage])
  foodImages: FoodImage[];

  @ManyToMany(() => Order, (orders) => orders.foods)
  @Field(() => [Order])
  orders: Order[];
}
