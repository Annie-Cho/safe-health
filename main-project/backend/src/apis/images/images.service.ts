// import { Injectable, UnprocessableEntityException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Image } from './entities/image.entity';

// @Injectable()
// export class ImagesService {
//   constructor(
//     @InjectRepository(Image)
//     private readonly imageRepository: Repository<Image>,
//   ) {}

//   findAll() {
//     return this.imageRepository.find();
//   }

//   findAllWithDeleted() {
//     return this.imageRepository.find({ withDeleted: true });
//   }

//   create({ createImageInput }) {
//     const { foodId, ...image } = createImageInput;
//     return this.imageRepository.save({
//       ...image,
//       food: { id: foodId },
//     });
//   }

//   async update({ imageId, updateImageInput }) {
//     const image = await this.imageRepository.findOne({
//       where: { id: imageId },
//     });

//     if (!image.isMain && updateImageInput.isMain) {
//       const isThereMain = await this.imageRepository.find({
//         where: { food: updateImageInput.foodId, isMain: true },
//       });

//       if (isThereMain.length !== 0) {
//         throw new UnprocessableEntityException('이미 메인이미지가 존재합니다.');
//       }
//     }

//     return this.imageRepository.save({
//       ...image,
//       id: imageId,
//       ...updateImageInput,
//     });
//   }

//   async delete({ imageId }) {
//     const result = await this.imageRepository.softDelete({ id: imageId });
//     return result.affected;
//   }
// }
