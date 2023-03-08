import { Global, Module } from '@nestjs/common';
import { ImagesService } from './services/images.service';

@Global()
@Module({
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
