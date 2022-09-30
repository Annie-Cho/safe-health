import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import 'dotenv/config';
import { Repository } from 'typeorm';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class IamportService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getAccessToken() {
    try {
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IMP_APIKEY, // REST API키
          imp_secret: process.env.IMP_APISECRET, // REST API Secret
        },
      });

      return getToken.data.response.access_token;
    } catch (error) {
      throw new UnprocessableEntityException(
        'Iamport Access Token을 가져오는데 실패하였습니다.',
      );
    }
  }

  async getPaymentData({ impUid, accessToken }) {
    try {
      const getData = await axios({
        url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
      });

      return getData.data.response;
    } catch (error) {
      throw new UnprocessableEntityException('유효하지 않은 impUid입니다.');
    }
  }

  async getCancelData({ impUid, reason, amount, accessToken }) {
    try {
      const getData = await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken, // 아임포트 서버로부터 발급받은 엑세스 토큰
        },
        data: {
          reason, // 가맹점 클라이언트로부터 받은 환불사유
          imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
          amount: amount, // 가맹점 클라이언트로부터 받은 환불금액
        },
      });
      // console.log('cancelData = ', getData.data);
      return getData.data.response;
    } catch (error) {
      throw new UnprocessableEntityException(
        '환불이 정상적으로 처리되지 않았습니다.',
      );
    }
  }
}
