import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Food } from '../foods/entities/food.entity';
import { User } from '../users/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  findAll() {
    return this.paymentRepository.find({
      relations: ['foods', 'user'],
    });
  }

  findOne({ paymentId }) {
    return this.paymentRepository.findOne({
      where: { id: paymentId }, //
      relations: ['foods', 'user'],
    });
  }

  // findByUser({ user }) {
  //   return this.paymentRepository.find({
  //     where: { user },
  //     relations: ['foods', 'user'],
  //   });
  // }

  async createPaidPayment({ user: _user, createPaymentInput }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    //Transaction 시작
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const { foodIds, ...payment } = createPaymentInput;

      //User 찾기
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      const result = [];
      for (let i = 0; i < foodIds.length; i++) {
        const newFood = await queryRunner.manager.findOne(Food, {
          where: { id: foodIds[i] },
          lock: { mode: 'pessimistic_write' },
        });
        if (newFood) {
          result.push(newFood);
        } else {
          //아마 나중에 프론트엔드에서 불러온다고 하면, id가 이미 정해져있기 때문에 굳이 필요없지 않을까?
          throw new ConflictException('존재하지 않는 상품입니다.');
        }
      }

      //payment 객체 생성
      const newPayment = this.paymentRepository.create({
        ...payment,
        user,
        foods: result,
      });

      //payment 저장
      await queryRunner.manager.save(newPayment);

      //User의 돈 업데이트된 객체 생성
      const updatedUser = this.userRepository.create({
        ...user,
        point: user.point + payment.amount,
      });

      //User 저장
      await queryRunner.manager.save(updatedUser);

      //commit
      await queryRunner.commitTransaction();

      return newPayment;
    } catch (error) {
      //rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      //연결해제
      await queryRunner.release();
    }
  }

  async createCanceledPayment({ user: _user, payment, cancel_amount }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    //Transaction 시작
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const { impUid, foods } = payment;
      //amount값 반영
      const newAmount = Number('-' + cancel_amount);

      //User 찾기
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      //Payment 객체 생성
      // const newPayment = this.paymentRepository.create({
      //   impUid,
      //   order_status: ORDER_STATUS_ENUM.ORDER_CANCELED,
      //   payment_status: PAYMENT_STATUS_ENUM.CANCELED,
      //   amount: newAmount,
      //   user,
      //   foods,
      // });

      //Payment 저장
      // await queryRunner.manager.save(newPayment);

      //User 객체 생성
      const updatedUser = this.userRepository.create({
        ...user,
        point: user.point + newAmount,
      });

      //User 저장
      await queryRunner.manager.save(updatedUser);

      //commit
      await queryRunner.commitTransaction();

      // return newPayment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkIsAlreadyAdded({ impUid }) {
    const paymentData = await this.paymentRepository.findOne({
      where: { impUid },
    });
    if (paymentData) {
      throw new ConflictException('이미 결제완료된 결제건입니다.');
    }
  }

  async checkIsAlreadyCanceled({ impUid }) {
    const payment = await this.paymentRepository.find({
      where: { impUid }, //
      relations: ['foods'],
    });

    if (payment.length === 0) {
      throw new UnprocessableEntityException('해당하는 결제건이 없습니다.');
    }

    //추후 부분취소 기능을 추가할 때 사용할 수 있을 듯!(DB에 2번 접근하는 방법도 있지만 DB에 자주접근하는 건 효율성이 낮을 듯)
    for (let i = 0; i < payment.length; i++) {
      // if (payment[i].payment_status === PAYMENT_STATUS_ENUM.CANCELED) {
      throw new UnprocessableEntityException('이미 취소된 결제건입니다.');
    }
  }

  // return payment.shift();
}

// checkIsPaid({ createPaymentInput, amount, status }) {
//   if (amount === createPaymentInput.amount) {
//     if (status === 'paid') {
//       return true;
//     } else {
//       throw new UnprocessableEntityException('결제가 완료되지 않았습니다.');
//     }
//   } else {
//     throw new UnprocessableEntityException('결제 금액이 불일치합니다.');
//   }
// }
