import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { UserGrade } from 'src/apis/usersGrades/entities/userGrade.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  pwd: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String)
  address: string;

  @Min(0)
  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserGrade)
  @Field(() => UserGrade)
  userGrade: UserGrade;
}
