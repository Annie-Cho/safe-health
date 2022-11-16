import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Grade } from 'src/apis/grades/entities/grade.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Min(0)
  @Column({ default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  point: number;

  @Column({ default: false, nullable: true })
  @Field(() => Boolean)
  seller: boolean;

  @Column({ default: false, nullable: true })
  @Field(() => Boolean)
  admin: boolean;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Grade, { nullable: true })
  @Field(() => Grade, { nullable: true })
  grade: Grade;
}
