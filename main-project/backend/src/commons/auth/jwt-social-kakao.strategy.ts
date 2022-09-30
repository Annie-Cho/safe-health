import { PassportStrategy } from '@nestjs/passport';
// import { KakaoStrategy } from 'passport-kakao';
import { Strategy } from 'passport-kakao';
import 'dotenv/config';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
      scope: ['account_email', 'profile_nickname'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    return {
      email: profile._json.kakao_account.email,
      hashedPwd: '1234',
      name: profile.username,
      address: '대한민국',
    };
  }
}
