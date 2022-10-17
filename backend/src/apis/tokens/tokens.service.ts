import { Injectable, NotFoundException } from '@nestjs/common';
import coolsms from 'coolsms-node-sdk';

@Injectable()
export class TokensService {
  createToken() {
    return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  }

  checkPhoneNumber(phoneNumber) {
    if (phoneNumber.length !== 10 && phoneNumber.length !== 11) {
      throw new NotFoundException('입력된 전화번호를 확인해주세요.');
    }
    return true;
  }

  async sendToken(phoneNumber, token) {
    try {
      const messageService = new coolsms(
        process.env.COOLSMS_API_KEY,
        process.env.COOLSMS_API_SECRET,
      );

      await messageService.sendOne({
        to: phoneNumber,
        from: process.env.COOLSMS_SENDER,
        text: `[SafeHealth] 인증번호 ${token}을 입력해주세요.`,
        type: 'SMS',
        autoTypeDetect: false,
      });
    } catch (error) {
      throw new NotFoundException('인증번호 전송에 실패하였습니다.');
    }
  }
}
