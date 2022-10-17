import { CACHE_MANAGER, Inject, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { TokensService } from './tokens.service';

@Resolver()
export class TokensResolver {
  constructor(
    private readonly tokensService: TokensService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => Boolean)
  async sendTokenToPhone(
    @Args('phoneNumber') phoneNumber: string, //
  ) {
    //전화번호 유효성 확인
    this.tokensService.checkPhoneNumber(phoneNumber);

    //이미 인증번호가 전송되었고 3분 이내에 재요청이 들어왔을 경우
    const cache = await this.cacheManager.get(phoneNumber);
    if (cache) {
      throw new NotFoundException('이미 인증번호가 전송된 전화번호입니다.');
    }

    //6자리 인증번호 생성
    const token = this.tokensService.createToken();

    //인증번호 보내기
    await this.tokensService.sendToken(phoneNumber, token);

    //Redis에 저장하기(3분이후 정보 파기)
    const isSaved = await this.cacheManager.set(phoneNumber, token, {
      ttl: 180,
    });
    if (isSaved !== 'OK') {
      throw new NotFoundException('인증번호 저장에 실패하였습니다.');
    }

    return true;
  }
}
