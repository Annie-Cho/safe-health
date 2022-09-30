// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// // import { CreateImageInput } from './dto/createImage.input';
// // import { UpdateImageInput } from './dto/updateImage.input';
// import { Image } from './entities/image.entity';
// import { ImagesService } from './images.service';

// @Resolver()
// export class ImagesResolver {
//   constructor(private readonly imagesService: ImagesService) {}

//   @Query(() => [Image])
//   fetchImages() {
//     return this.imagesService.findAll();
//   }

//   @Query(() => [Image])
//   fetchImagesWithDeleted() {
//     return this.imagesService.findAllWithDeleted();
//   }

//   // @Mutation(() => Image)
//   // createImage(
//   //   @Args('createImageInput') createImageInput: CreateImageInput, //
//   // ) {
//   //   return this.imagesService.create({ createImageInput });
//   // }

//   // @Mutation(() => Image)
//   // updateImage(
//   //   @Args('imageId') imageId: string,
//   //   @Args('updateImageInput') updateImageInput: UpdateImageInput,
//   // ) {
//   //   return this.imagesService.update({ imageId, updateImageInput });
//   // }

//   @Mutation(() => Boolean)
//   deleteImage(
//     @Args('imageId') imageId: string, //
//   ) {
//     return this.imagesService.delete({ imageId });
//   }
// }
