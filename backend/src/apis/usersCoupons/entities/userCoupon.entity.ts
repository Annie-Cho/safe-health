import { Field, ObjectType } from '@nestjs/graphql';
import { Coupon } from 'src/apis/coupons/entities/coupon.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class UserCoupon {
  @PrimaryColumn()
  @Field(() => String)
  user_id: string;

  @PrimaryColumn()
  @Field(() => String)
  coupon_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @Field(() => User)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @ManyToOne(() => Coupon, (coupon) => coupon.id)
  @Field(() => Coupon)
  @JoinColumn({ name: 'coupon_id' })
  public coupon!: Coupon;

  @Column()
  @Field(() => Boolean)
  isUsed: boolean;
}
