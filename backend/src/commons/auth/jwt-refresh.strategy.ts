import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        // console.log(req);
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }

  async validate(request, payload) {
    const refreshToken = request.headers.cookie.replace('=', ':');
    const refreshAccess = await this.cacheManager.get(refreshToken);
    if (refreshAccess) {
      throw new UnauthorizedException();
    }

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
