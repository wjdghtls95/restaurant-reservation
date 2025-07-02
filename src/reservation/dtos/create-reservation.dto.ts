import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '../../utils/dto/base-out.dto';
import { MenuDto } from '../../menu/dtos/menu.dto';

export class CreateReservationDto extends BaseOutDto {
  @ApiProperty({ description: '예약 아이디' })
  reservationId: number;

  @ApiProperty({ description: '예약 고객 이름' })
  customerName: string;

  @ApiProperty({ description: '예약 식당 이름' })
  restaurantName: string;

  @ApiProperty({
    description: '예약 시작 시간',
    default: '2025-07-02T14:30',
  })
  startTime: Date;

  @ApiProperty({
    description: '예약 종료 시간',
    default: '2025-07-02T14:30',
  })
  endTime: Date;

  @ApiProperty({ description: '고객 전화번호' })
  phoneNumber: string;

  @ApiProperty({ description: '예약 인원 수' })
  peopleCount: number;

  @ApiProperty({
    description: '주문예약 메뉴 목록',
  })
  menus: MenuDto[];
}
