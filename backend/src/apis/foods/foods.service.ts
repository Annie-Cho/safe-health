import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodImage } from '../foodImages/entities/foodImage.entity';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,

    @InjectRepository(FoodImage)
    private readonly foodImageRepository: Repository<FoodImage>,
  ) {}

  findAll() {
    return this.foodRepository.find({
      relations: ['subCategory', 'images'],
    });
  }

  findAllWithDeleted() {
    return this.foodRepository.find({
      withDeleted: true,
      relations: ['subCategory', 'images'],
    });
  }

  findNewestFood() {
    return this.foodRepository.find({
      relations: ['subCategory', 'images'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  findOne({ foodId }) {
    return this.foodRepository.findOne({
      where: { id: foodId },
      relations: ['subCategory', 'images'],
    });
  }

  async create({ createFoodInput }) {
    const { subCategoryId, images, ...food } = createFoodInput;

    //상품 데이터 저장
    const foodResult = await this.foodRepository.save({
      ...food,
      subCategory: { id: subCategoryId },
    });

    //이미지 데이터 저장
    const imageResult = await Promise.all(
      images.map(
        (ele, idx) =>
          new Promise((resolve, reject) => {
            this.foodImageRepository.save({
              url: ele.url,
              isMain: idx === 0 ? true : false,
              food: foodResult,
            });
            resolve('이미지 저장 성공');
            reject('이미지 저장 실패');
          }),
      ),
    );

    //저장된 상품 데이터를 이미지 테이블과 조인하여 리턴
    console.log('id = ', foodResult.id);
    const createdResult = await this.foodRepository.findOne({
      where: { id: foodResult.id },
      relations: ['images', 'subCategory'],
      // relations: { images: true, subCategory: true },
    });

    const result = this.foodRepository.create({
      ...createdResult,
      // images,
    });
    return result;
  }

  async update({ foodId, updateFoodInput }) {
    const { images, ...food } = updateFoodInput;

    //기존 상품 데이터 가져오기
    const myFood = await this.foodRepository.findOne({
      where: { id: foodId },
    });
    if (!myFood) {
      throw new UnprocessableEntityException('해당 상품이 존재하지 않습니다.');
    }

    //상품과 일치하는 이미지 데이터 삭제하기
    const _images = await this.foodImageRepository.find({
      where: { food: myFood },
    });
    if (_images.length !== 0) {
      const deleteImages = await Promise.all(
        _images.map(
          (ele) =>
            new Promise((resolve, reject) => {
              this.foodImageRepository.softDelete({ id: ele.id });
              resolve('이미지 삭제 성공');
              reject('이미지 삭제 실패');
            }),
        ),
      );
    }

    //새로운 이미지 url 저장
    const imageResult = await Promise.all(
      images.map(
        (ele, idx) =>
          new Promise((resolve, reject) => {
            this.foodImageRepository.save({
              url: ele.url,
              isMain: idx === 0 ? true : false,
              food: myFood,
            });
            resolve('이미지 저장 성공');
            reject('이미지 저장 실패');
          }),
      ),
    );

    const result = this.foodRepository.save({
      ...myFood,
      id: foodId,
      ...updateFoodInput,
    });
    return result;
  }

  /* 조금 더 구상중
  async checkImageMain({ updateFoodInput }) {
    const { images, ...rest } = updateFoodInput;

    const 
    for (let i = 0; i < images.length; i++) {
      const result = await this.imageRepository.findOne({
        where: { id: images[i].id },
      });

      if(result.isMain && images[i].isMain)
    }
  }
  */

  async checkSoldout({ foodId }) {
    const food = await this.foodRepository.findOne({
      where: { id: foodId },
    });

    // if (food.isSoldout) {
    //   throw new UnprocessableEntityException('현재 품절된 상품입니다.');
    // }
  }

  async delete({ foodId }) {
    const imageResult = await this.foodImageRepository.softDelete({
      food: foodId,
    });

    if (imageResult.affected) {
      const result = await this.foodRepository.softDelete({ id: foodId });
      return result.affected;
    } else {
      throw new HttpException(
        '해당 상품의 이미지를 삭제할 수 없습니다.',
        HttpStatus.CONFLICT,
      );
    }
  }

  async restore({ foodId }) {
    const imageResult = await this.foodImageRepository.restore({
      food: foodId,
    });
    if (imageResult.affected) {
      const result = await this.foodRepository.restore({ id: foodId });
      return result.affected;
    } else {
      throw new HttpException(
        '해당 상품의 이미지를 가져올 수 없습니다.',
        HttpStatus.CONFLICT,
      );
    }
  }

  makeItem({ data }) {
    const result = data.map((ele) => {
      const { subcategoryid, imageid, url, ...rest } = ele['_source'];

      return this.foodRepository.create({
        ...rest,
        subCategory: subcategoryid,
        images: [{ id: imageid, url: url }], //이미지는 대표 이미지만 가지고 옴.
      });
    });

    return result;
  }
}
