import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMenusForm {
  @ApiPropertyOptional({ description: '검색할 메뉴 이름 (일부 일치)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '최소 가격' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: '최대 가격' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
