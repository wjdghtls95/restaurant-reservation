import { IsArray, IsInt, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReservationForm {
  @ApiPropertyOptional({ description: '예약 인원 수' })
  @IsInt()
  @Min(1)
  peopleCount?: number;

  @ApiPropertyOptional({ description: '예약한 메뉴들' })
  @IsArray()
  @IsNumber({}, { each: true })
  menuIds?: number[];
}
