import { Field, ObjectType } from '@nestjs/graphql';
import { Coupon } from 'src/apis/coupons/entities/coupon.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CouponList {
  @PrimaryColumn()
  @Field(() => String)
  userId: string;

  @PrimaryColumn()
  @Field(() => String)
  couponId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  public user!: User;

  @ManyToOne(() => Coupon, (coupon) => coupon.id)
  @JoinColumn({ name: 'couponId' })
  public coupon!: Coupon;

  @Column({ default: false, nullable: true })
  @Field(() => Boolean)
  isUsed: boolean;
}
