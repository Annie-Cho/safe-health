import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { Food } from '../foods/entities/food.entity';
import { Grade } from '../grades/entities/grade.entity';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Payment } from './entities/payment.entity';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      Food,
      User,
      Grade,
    ]),
  ],
  providers: [
    JwtAccessStrategy, //
    IamportService,
    PaymentsResolver,
    PaymentsService,
    UsersService,
  ],
})
export class PaymentsModule {}
