import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comments/entities/comment.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CommentImages {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String, { nullable: true })
  url: string;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: true })
  isMain: boolean;

  @ManyToOne(() => Comment, (comment) => comment.images)
  @Field(() => Comment)
  comment: Comment;
}
