import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UsersService } from '../users/users.service';
import { PaymentsService } from './payments.service';
import { CreatePaymentInput } from './dto/createPayment.input';
import { IContext } from 'src/commons/type/context';
import { IamportService } from '../iamport/iamport.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly iamportService: IamportService,
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Payment])
  fetchPayments() {
    return this.paymentsService.findAll();
  }

  @Query(() => Payment)
  fetchPayment(
    @Args('paymentId') paymentId: string, //
  ) {
    return this.paymentsService.findOne({ paymentId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Payment])
  async fetchPaymentByUser(@Context() context: IContext) {
    const email = context.req.user.email;
    const user = await this.usersService.findOne({ email });

    return this.paymentsService.findByUser({ user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
    @Context() context: IContext,
  ) {
    //아임포트에서 access 토큰 받아오기
    const accessToken = await this.iamportService.getAccessToken();

    //유효한 impUid인지 확인하기
    const impUid = createPaymentInput.impUid;
    const payment = await this.iamportService.getPaymentData({
      impUid,
      accessToken,
    });
    const { amount, imp_uid, status } = payment;

    //이미 추가된 결제건인지 확인하기
    await this.paymentsService.checkIsAlreadyAdded({ impUid: imp_uid });

    //결제 추가 검증
    this.paymentsService.checkIsPaid({
      createPaymentInput,
      amount,
      status,
    });

    //Payment테이블에 추가하기
    const user = context.req.user;
    return this.paymentsService.createPaidPayment({ user, createPaymentInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async cancelPayment(
    @Args('impUid') impUid: string,
    @Args('reason') reason: string,
    @Context() context: IContext,
  ) {
    //이미 취소된 결제인지 검증
    const payment = await this.paymentsService.checkIsAlreadyCanceled({
      impUid,
    });

    //아임포트에서 access 토큰 받아오기
    const accessToken = await this.iamportService.getAccessToken();

    //아임포트로 결제환불 요청
    const cancelPayment = await this.iamportService.getCancelData({
      impUid,
      reason,
      amount: payment.amount,
      accessToken,
    });

    //Payment테이블에 추가하기
    const user = context.req.user;
    const { cancel_amount } = cancelPayment;
    return this.paymentsService.createCanceledPayment({
      user,
      payment,
      cancel_amount,
    });
  }

  @Mutation(() => Payment)
  updateOrderStatus(
    @Args('paymentId') paymentId: string, //
    @Args('orderStatus') orderStatus: string,
  ) {
    return this.paymentsService.update({ paymentId, orderStatus });
  }
}
