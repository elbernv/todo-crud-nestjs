import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { QueryBase } from '@core/dtos/query-base.dto';
import { TasksOrderBy } from '@task/enums/task.enum';

export class AllTasksQuery extends QueryBase {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TasksOrderBy)
  orderBy?: TasksOrderBy;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderByType?: 'asc' | 'desc';
}
