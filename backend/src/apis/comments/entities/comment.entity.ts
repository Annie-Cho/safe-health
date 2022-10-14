import { Field, Float, ObjectType } from '@nestjs/graphql';
import { CommentImages } from 'src/apis/commentImages/entities/commentImage.entity';
import { CommentAnswer } from 'src/apis/commentsAnswers/entities/commentAnswer.entity';
import { Food } from 'src/apis/foods/entities/food.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String, { nullable: true })
  contents: string;

  @Column({ type: 'float' })
  @Field(() => Float, { nullable: true })
  score: number;

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
  @OneToOne(() => CommentAnswer)
  @Field(() => CommentAnswer)
  commentAnswer: CommentAnswer;

  //For Image
  @OneToMany(() => CommentImages, (images) => images.comment)
  @Field(() => [CommentImages])
  images: CommentImages[];
}
