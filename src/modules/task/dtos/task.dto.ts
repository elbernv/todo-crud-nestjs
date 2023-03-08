import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { IsDateOrNull } from '@core/custom-validators/is-date-or-null.validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateOrNull()
  finishedAt?: Date | string | null;
}
