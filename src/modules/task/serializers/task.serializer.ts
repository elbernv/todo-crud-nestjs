import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { task } from '@prisma/client';

@Injectable()
export class TaskSerializer {
  constructor(private readonly configService: ConfigService) {}

  public serialize(task: task) {
    return {
      id: task.id,
      name: task.name,
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      finishedAt: task.finishedAt,
      image: this.serializeImage(task.imagePath),
    };
  }

  private serializeImage(taskImageName: string) {
    if (!taskImageName) return null;

    return `${this.configService.get(
      'BASE_URL',
    )}/tasks/images/${taskImageName}`;
  }

  public serializeMany(tasks: Array<task>) {
    const newArray = tasks.map((task) => this.serialize(task));

    return newArray;
  }
}
