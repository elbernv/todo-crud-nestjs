import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@core/prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from '@task/task.module';
import { ImagesModule } from './core/images/images.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TaskModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
