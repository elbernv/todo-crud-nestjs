import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { AllTasksQuery } from '@task/dtos/allTasksQuery.dto';
import { ROUTES } from '@core/routes/routes.enum';

@Injectable()
export class TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createTask(createArgs: Prisma.taskCreateArgs) {
    return this.prismaService.task.create(createArgs);
  }

  public async findFirtsOrThrow(findOptions: Prisma.taskFindFirstOrThrowArgs) {
    try {
      return await this.prismaService.task.findFirstOrThrow(findOptions);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  public async findManyTask(
    findOptions: Prisma.taskFindManyArgs,
    queryParams: AllTasksQuery,
    paginated: boolean = false,
  ) {
    if (!paginated) {
      return this.prismaService.task.findMany(findOptions);
    }

    return this.prismaService.paginatedSearch(
      this.prismaService.task,
      findOptions,
      ROUTES.TASKS,
      queryParams as any,
    );
  }

  public async updateTask(updateArgs: Prisma.taskUpdateArgs) {
    return this.prismaService.task.update(updateArgs);
  }
}
