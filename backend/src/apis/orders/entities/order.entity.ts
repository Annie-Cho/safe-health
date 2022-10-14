import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Food } from 'src/apis/foods/entities/food.entity';
import { Payment } from 'src/apis/payments/entities/payment.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ORDER_STATUS_ENUM {
  ORDERED = '주문완료',
  ORDER_CANCELED = '주문취소',
  PREPARE = '배송준비중',
  DILIVERY_STARTED = '배송중',
  DILIVERED = '배송완료',
}

registerEnumType(ORDER_STATUS_ENUM, {
  name: 'ORDER_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ORDER_STATUS_ENUM,
    default: ORDER_STATUS_ENUM.ORDERED,
  })
  @Field(() => String)
  status: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;

  @JoinTable()
  @ManyToMany(() => Food, (foods) => foods.orders)
  @Field(() => [Food])
  foods: Food[];
}
