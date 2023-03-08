import { PaginatedResult } from '@core/prisma/interfaces/pagination-result.interface';
import { Injectable } from '@nestjs/common';
import { Prisma, task } from '@prisma/client';

import { AllTasksQuery } from '@task/dtos/allTasksQuery.dto';
import { CreateTaskDto, UpdateTaskDto } from '@task/dtos/task.dto';
import { TaskRepository } from '@task/repositories/task.repository';
import { TaskSerializer } from '@task/serializers/task.serializer';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskSerializer: TaskSerializer,
  ) {}

  public async createTask(body: CreateTaskDto, image?: Express.Multer.File) {
    const taskData: Prisma.taskCreateArgs = {
      data: {
        name: body.name,
        description: body.description,
        ...(image && { imagePath: image.filename }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        finishedAt: true,
        imagePath: true,
      },
    };

    const newTask = await this.taskRepository.createTask(taskData);

    return this.taskSerializer.serialize(newTask);
  }

  public async getOneTask(taskId: number) {
    const findOptions: Prisma.taskFindFirstOrThrowArgs = {
      where: { id: taskId, deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        finishedAt: true,
        imagePath: true,
      },
    };

    const task = await this.taskRepository.findFirtsOrThrow(findOptions);

    return this.taskSerializer.serialize(task);
  }

  public async getAllTasks(queryParams: AllTasksQuery) {
    const findOptions: Prisma.taskFindManyArgs = {
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        finishedAt: true,
        imagePath: true,
      },
      ...(queryParams.orderBy && {
        orderBy: { [queryParams.orderBy]: queryParams.orderByType || 'asc' },
      }),
    };

    const tasks = (await this.taskRepository.findManyTask(
      findOptions,
      queryParams,
      true,
    )) as PaginatedResult<task>;

    const serializedTasks = this.taskSerializer.serializeMany(tasks.data);

    tasks.data = serializedTasks as any;

    return tasks;
  }

  public async updateTask(
    id: number,
    body: UpdateTaskDto,
    image?: Express.Multer.File,
  ) {
    await this.getOneTask(id);
    body.finishedAt === '' && (body.finishedAt = null);

    const updateTaskData: Prisma.taskUpdateArgs = {
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(image && { imagePath: image.filename }),
        ...((body.finishedAt || body.finishedAt === null) && {
          finishedAt: body.finishedAt,
        }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        finishedAt: true,
        imagePath: true,
      },
    };

    const updatedTask = await this.taskRepository.updateTask(updateTaskData);

    return this.taskSerializer.serialize(updatedTask);
  }

  public async deleteTask(taskId: number) {
    const updateTaskData: Prisma.taskUpdateArgs = {
      where: { id: taskId },
      data: { deletedAt: new Date() },
    };

    await this.taskRepository.updateTask(updateTaskData);

    return { message: 'task deleted' };
  }
}
