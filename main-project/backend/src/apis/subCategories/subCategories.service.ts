import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subCategory.entity';
import { Food } from '../foods/entities/food.entity';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,

    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  findAll() {
    return this.subCategoryRepository.find({ relations: ['mainCategory'] });
  }

  create({ createSubCategory }) {
    const { mainCategoryId, name } = createSubCategory;
    return this.subCategoryRepository.save({
      name,
      mainCategory: { id: mainCategoryId },
    });
  }

  async update({ subCategoryId, updateSubCategory }) {
    const result = await this.subCategoryRepository.findOne({
      where: { id: subCategoryId },
      relations: ['mainCategory'],
    });

    const { name, mainCategoryId } = updateSubCategory;
    return this.subCategoryRepository.save({
      ...result,
      id: subCategoryId,
      name,
      mainCategory: { id: mainCategoryId },
      // ...updateSubCategory,
    });
  }

  async delete({ subCategoryId }) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id: subCategoryId },
    });

    const checkFoods = await this.foodRepository.find({
      where: { subCategory },
      relations: ['subCategory', 'images'],
    });

    if (checkFoods.length !== 0) {
      throw new HttpException(
        '해당 카테고리에 상품이 담겨있으므로 삭제할 수 없습니다.',
        HttpStatus.CONFLICT,
      );
    } else {
      const result = await this.subCategoryRepository.softDelete({
        id: subCategoryId,
      });
      return result.affected;
    }
  }

  async restore({ subCategoryId }) {
    const result = await this.subCategoryRepository.restore({
      id: subCategoryId,
    });
    return result.affected;
  }
}
