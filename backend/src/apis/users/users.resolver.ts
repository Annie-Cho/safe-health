import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @Query(() => [User])
  fetchUsersWithDeleted() {
    return this.usersService.findAllWithDeleted();
  }

  @Query(() => User)
  fetchUser(@Args('email') email: string) {
    return this.usersService.findOne({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(@Context() context: any) {
    const email = context.req.user.email;
    return this.usersService.findOne({ email });
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

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update({ email, updateUserInput });
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
