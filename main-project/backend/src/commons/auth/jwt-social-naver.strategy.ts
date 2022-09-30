import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import 'dotenv/config';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      //   scope: ['email', 'profile'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    return {
      email: profile.email,
      hashedPwd: '1234',
      name: profile.name,
      address: '대한민국',
    };
  }
}
