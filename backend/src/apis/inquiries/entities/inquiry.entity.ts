import { Field, ObjectType } from '@nestjs/graphql';
import { Food } from 'src/apis/foods/entities/food.entity';
import { InquiryAnswer } from 'src/apis/InquiryAnswers/entities/inquiryAnswer.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Food)
  @Field(() => Food)
  food: Food;

  @JoinColumn()
  @OneToOne(() => InquiryAnswer)
  inquiryAnswer: InquiryAnswer;
}
