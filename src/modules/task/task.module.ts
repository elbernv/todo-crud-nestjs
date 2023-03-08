import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { diskStorage } from 'multer';

import { TaskController } from '@task/controllers/task.controller';
import { TaskService } from '@task/services/task.service';
import { TaskRepository } from '@task/repositories/task.repository';
import { TaskSerializer } from '@task/serializers/task.serializer';
import { editFileName } from '@utils/file-upload.utils';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('IMAGES_FOLDER'),
          filename: editFileName,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, TaskSerializer],
})
export class TaskModule {}
