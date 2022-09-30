import { Field, ObjectType } from '@nestjs/graphql';
import { Coupon } from 'src/apis/coupons/entities/coupon.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class UserGrade {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 4 })
  @Field(() => String)
  name: string;

  @JoinTable()
  @Field(() => [Coupon])
  @ManyToMany(() => Coupon, (coupons) => coupons.userGrades)
  coupons: Coupon[];
}
