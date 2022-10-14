import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Coupon } from 'src/apis/coupons/entities/coupon.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PAYMENT_STATUS_ENUM {
  PAID = '결제완료',
  CANCELED = '결제취소',
}

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int, { nullable: true })
  price: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS_ENUM,
    default: PAYMENT_STATUS_ENUM.PAID,
  })
  @Field(() => PAYMENT_STATUS_ENUM)
  status: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinColumn()
  @Field(() => Coupon)
  @OneToOne(() => Coupon)
  coupon: Coupon;
}
