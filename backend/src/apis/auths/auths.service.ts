import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly usersService: UsersService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id }, //
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    // console.log('==============');
    // console.log(refreshToken);
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id }, //
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
  }

  async socialLogin({ req, res }) {
    //가입확인
    let user = await this.usersService.findOne({ email: req.user.email });

    //회원가입
    if (!user) {
      user = await this.usersService.create({ ...req.user });
    }

    //로그인
    this.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }

  async checkAndSaveTokens({ accessToken, refreshToken }) {
    try {
      //현재 시간
      const currentTime = new Date();
      const currentSec = Math.abs(currentTime.getTime() / 1000);

      //AccessToken 검증
      const accessDecoded = jwt.verify(accessToken, 'myAccessKey');
      const lastAccessTime = Math.ceil(accessDecoded['exp'] - currentSec);

      accessToken = 'accessToken:' + accessToken;

      //Redis에 AccessToken 저장
      const accessResult = await this.cacheManager.set(
        accessToken,
        accessDecoded,
        {
          ttl: lastAccessTime,
        },
      );

      //RefreshToken 검증
      const refreshDecoded = jwt.verify(refreshToken, 'myRefreshKey');
      const lastRefreshTime = Math.ceil(refreshDecoded['exp'] - currentSec);

      refreshToken = 'refreshToken:' + refreshToken;

      //Redis에 RefreshToken 저장
      const refreshResult = await this.cacheManager.set(
        refreshToken,
        refreshDecoded,
        {
          ttl: lastRefreshTime,
        },
      );

      if (accessResult === 'OK' && refreshResult === 'OK') {
        return '로그아웃에 성공했습니다.';
      } else {
        throw new ConflictException('로그아웃에 실패하였습니다.');
      }
    } catch (error) {
      throw new ConflictException('해당 사용자의 토큰이 올바르지 않습니다.');
    }
  }
}
