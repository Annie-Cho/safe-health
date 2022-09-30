import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findAllWithDeleted() {
    return this.userRepository.find({ withDeleted: true });
  }

  async findOne({ email }) {
    const result = await this.userRepository.findOne({ where: { email } });
    // if (!result) {
    //   throw new UnprocessableEntityException(
    //     '해당하는 사용자 정보가 없습니다.',
    //   );
    // } else {
    //   return result;
    // } //google 로그인하면서 없을 경우 넘어가지를 않아 주석처리
    return result;
  }

  create({ hashedPwd: pwd, email, name, address }) {
    return this.userRepository.save({
      pwd, //
      email,
      name,
      address,
    });
  }

  async checkIsAvailable({ email }) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new UnprocessableEntityException('이미 사용중인 아이디입니다.');
    }
  }

  async update({ email, updateUserInput }) {
    const user = await this.userRepository.findOne({ where: { email } });

    return this.userRepository.save({
      ...user,
      id: user.id,
      ...updateUserInput,
    });
  }

  async updatePwd({ email, hashedPwd: pwd }) {
    const user = await this.userRepository.findOne({ where: { email } });

    return this.userRepository.save({
      ...user,
      id: user.id,
      pwd,
    });
  }

  async delete({ email }) {
    const result = await this.userRepository.softDelete({ email });
    return result.affected;
  }

  async restore({ email }) {
    const result = await this.userRepository.restore({ email });
    return result.affected;
  }
}
