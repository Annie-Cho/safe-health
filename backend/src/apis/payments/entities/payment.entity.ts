import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Coupon } from 'src/apis/coupons/entities/coupon.entity';
import { Food } from 'src/apis/foods/entities/food.entity';
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

export enum PAYMENT_STATUS_ENUM {
  PAID = '결제완료',
  CANCELED = '결제취소',
}

registerEnumType(ORDER_STATUS_ENUM, {
  name: 'ORDER_STATUS_ENUM',
});

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({
    type: 'enum',
    enum: ORDER_STATUS_ENUM,
    default: ORDER_STATUS_ENUM.ORDERED,
  })
  @Field(() => ORDER_STATUS_ENUM)
  order_status: string;

  @Min(0)
  @Column()
  @Field(() => Int)
  amount: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS_ENUM,
    default: PAYMENT_STATUS_ENUM.PAID,
  })
  @Field(() => PAYMENT_STATUS_ENUM)
  payment_status: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @Field(() => Coupon)
  @OneToOne(() => Coupon)
  coupon: Coupon;

  @JoinTable()
  @Field(() => [Food])
  @ManyToMany(() => Food, (foods) => foods.payments)
  foods: Food[];
}
