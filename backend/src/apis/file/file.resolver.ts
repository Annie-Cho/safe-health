import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileSerivice: FileService) {}

  @Mutation(() => [String])
  uploadFiles(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return this.fileSerivice.uploadMany({ files });
  }
}
