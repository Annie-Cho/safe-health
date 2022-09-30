import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }

  async validate(request, payload) {
    const accessToken = request.headers.authorization.replace(
      'Bearer ',
      'accessToken:',
    );
    const accessCache = await this.cacheManager.get(accessToken);
    if (accessCache) {
      throw new UnauthorizedException();
    }
    // console.log('accessCache : ', accessCache);

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
