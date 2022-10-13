import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { AuthsService } from './auths.service';
import * as bcrypt from 'bcrypt';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';

@Resolver()
export class AuthsResolver {
  constructor(
    private readonly authsService: AuthsService, //
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('pwd') pwd: string,
    @Context() context: IContext,
  ) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');
    }

    const isAuth = await bcrypt.compare(pwd, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');
    }

    this.authsService.setRefreshToken({
      user, //
      res: context.res,
    });

    return this.authsService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: IContext) {
    const accessToken = context.req.headers['authorization'].split(' ')[1];
    const refreshToken = context.req.headers['cookie'].split('=')[1];

    //accessToken, refreshToken 검증 및 Redis에 저장
    return this.authsService.checkAndSaveTokens({ accessToken, refreshToken });

    // return '12345';
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }
}
