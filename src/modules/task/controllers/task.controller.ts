import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Response,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response as IResponse } from 'express';

import { imageFileFilter } from '@utils/file-upload.utils';
import { ROUTES } from '@core/routes/routes.enum';
import { ImagesService } from '@core/images/services/images.service';
import { TaskService } from '@task/services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '@task/dtos/task.dto';
import { AllTasksQuery } from '@task/dtos/allTasksQuery.dto';
import { IMAGE_FOLDERS } from '@core/images/enums/folders.enum';

@ApiTags(ROUTES.TASKS)
@Controller(ROUTES.TASKS)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly imagesService: ImagesService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { fileFilter: imageFileFilter }))
  async createTask(
    @Body() body: CreateTaskDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.taskService.createTask(body, image);
  }

  @Get(':id')
  async getOneTask(@Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.getOneTask(taskId);
  }

  @Get()
  async getAllTasks(@Query() queryParams: AllTasksQuery) {
    return this.taskService.getAllTasks(queryParams);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { fileFilter: imageFileFilter }))
  async updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() body: UpdateTaskDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.taskService.updateTask(taskId, body, image);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.deleteTask(taskId);
  }

  @Get('images/:name')
  async serveTaskImage(
    @Param('name') name: string,
    @Response({ passthrough: true }) response: IResponse,
  ) {
    return this.imagesService.serveImage(name, IMAGE_FOLDERS.ROOT, response);
  }
}
