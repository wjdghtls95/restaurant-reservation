import { IsInt, IsString, IsDateString, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationForm {
  @ApiProperty({ description: '예약한 식당 아이디' })
  @IsInt()
  restaurantId: number;

  @ApiProperty({ description: '예약 시작 시간' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: '예약 종료 시간' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ description: '예약한 고객 전화번호' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: '예약 인원' })
  @IsInt()
  @Min(1)
  peopleCount: number;

  @ApiProperty({
    description: '예약한 메뉴 아이디들',
    type: Number,
    isArray: true,
  })
  @IsArray()
  menuIds: number[];
}
