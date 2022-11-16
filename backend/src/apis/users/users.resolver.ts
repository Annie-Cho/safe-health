import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { ConflictException, UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  async fetchUsers(
    @Context() context: any, //
  ) {
    //관리자 여부 확인
    const email = context.req.user.email;
    await this.usersService.checkIsAdmin(email);

    //등록된 유저 목록 조회
    return this.usersService.findAll();
  }

  @Query(() => [User])
  fetchUsersWithDeleted() {
    return this.usersService.findAllWithDeleted();
  }

  @Query(() => User)
  fetchUser(@Args('email') email: string) {
    return this.usersService.findOne(email);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(@Context() context: any) {
    const email = context.req.user.email;
    return this.usersService.findOne(email);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    await this.usersService.checkIsAvailable({
      email: createUserInput.email,
    });

    const { password, ...user } = createUserInput;
    // const { password, email, name, address } = createUserInput;
    const hashedPwd = await bcrypt.hash(password, 10);
    console.log(hashedPwd);
    return this.usersService.create({ hashedPwd, ...user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context: IContext,
  ) {
    const email = context.req.user.email;

    //유저 정보 조회
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new ConflictException('유저 정보를 조회할 수 없습니다.');
    }

    //유저 정보 업데이트
    return this.usersService.update(user, updateUserInput);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPwd(
    @Context() context: any, //
    @Args('pwd') pwd: string,
  ) {
    const email = context.req.user.email;
    const hashedPwd = await bcrypt.hash(pwd, 10);
    return this.usersService.updatePwd({ email, hashedPwd });
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('email') email: string) {
    return this.usersService.delete({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(@Context() context: any) {
    const email = context.req.user.email;
    return this.usersService.delete({ email });
  }

  @Mutation(() => Boolean)
  restoreUser(@Args('email') email: string) {
    return this.usersService.restore({ email });
  }
}
