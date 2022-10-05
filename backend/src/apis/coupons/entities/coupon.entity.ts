import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { UserGrade } from 'src/apis/usersGrades/entities/userGrade.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Coupon {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  desc: string;

  @ManyToMany(() => UserGrade, (userGrades) => userGrades.coupons)
  @Field(() => [UserGrade])
  userGrades: UserGrade[];
}
