import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainCategory } from './entities/mainCategory.entity';

@Injectable()
export class MainCategoriesService {
  constructor(
    @InjectRepository(MainCategory)
    private readonly mainCategoryRepository: Repository<MainCategory>,
  ) {}

  findAll() {
    return this.mainCategoryRepository.find();
  }

  findAllWithDeleted() {
    return this.mainCategoryRepository.find({ withDeleted: true });
  }

  create({ createMainCategoryInput }) {
    return this.mainCategoryRepository.save(createMainCategoryInput);
  }

  update({ mainCategoryId, updateMainCategoryInput }) {
    return this.mainCategoryRepository.save({
      id: mainCategoryId,
      name: updateMainCategoryInput.name,
    });
  }

  async delete({ mainCategoryId }) {
    const result = await this.mainCategoryRepository.softDelete({
      id: mainCategoryId,
    });
    return result.affected;
  }

  async restore({ mainCategoryId }) {
    const result = await this.mainCategoryRepository.restore({
      id: mainCategoryId,
    });
    return result.affected;
  }
}
