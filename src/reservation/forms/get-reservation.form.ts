import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, Matches } from 'class-validator';

export class GetReservationForm {
  @ApiPropertyOptional({ description: '전화번호 일부 검색 (LIKE)' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: '예약 날짜 (YYYY-MM-DD)' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date는 YYYY-MM-DD 형식이어야 합니다.',
  })
  date?: string;

  @ApiPropertyOptional({ description: '최소 인원수' })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  minPeople?: number;

  @ApiPropertyOptional({ description: '포함된 메뉴 ID' })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  menuId?: number;
}
