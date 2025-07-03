import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { UserType } from '../auth/enums/user-type.enum';
import { Auth } from 'src/utils/decorator/auth.decorator';
import { ApiResponseEntity } from '../utils/response/api-response-entity.decorator';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { ResponseEntity } from '../utils/response/response-entity';
import { UserPayload } from '../utils/interface/user-payload.interface';
import { CreateReservationForm } from './forms/create-reservation.form';
import { GetReservationDto } from './dtos/get-reservation.dto';
import { GetReservationForm } from './forms/get-reservation.form';
import { UpdateReservationDto } from './dtos/update-reservation.dto';
import { UpdateReservationForm } from './forms/update-reservation.form';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Auth(UserType.CUSTOMER)
  @Post()
  @ApiResponseEntity({
    summary: '고객 - 예약 생성',
    type: CreateReservationDto,
  })
  async createReservation(
    @CurrentUser() user: UserPayload,
    @Body() createReservationForm: CreateReservationForm,
  ): Promise<ResponseEntity<CreateReservationDto>> {
    const createReservationDto =
      await this.reservationService.createReservation(
        user.id,
        createReservationForm,
      );

    return ResponseEntity.ok(createReservationDto);
  }

  @Auth(UserType.CUSTOMER)
  @Get('me')
  @ApiResponseEntity({
    summary: '고객 - 예약 조건별 조회',
    type: GetReservationDto,
    isArray: true,
  })
  async getMyReservations(
    @CurrentUser() user: UserPayload,
    @Query() getReservationForm: GetReservationForm,
  ): Promise<ResponseEntity<GetReservationDto[]>> {
    const reservations =
      await this.reservationService.getReservationsByCustomer(
        user.id,
        getReservationForm,
      );

    return ResponseEntity.ok(reservations);
  }

  @Auth(UserType.RESTAURANT)
  @Get('restaurant/me')
  @ApiResponseEntity({
    summary: '식당 - 예약 조건별 조회',
    type: GetReservationDto,
    isArray: true,
  })
  async getReservationsByRestaurant(
    @CurrentUser() user: UserPayload,
    @Query() getReservationForm: GetReservationForm,
  ): Promise<ResponseEntity<GetReservationDto[]>> {
    const reservations =
      await this.reservationService.getReservationsByRestaurant(
        user.id,
        getReservationForm,
      );

    return ResponseEntity.ok(reservations);
  }

  @Auth(UserType.CUSTOMER)
  @Patch(':id')
  @ApiResponseEntity({
    summary: '고객 - 예약 수정',
    type: UpdateReservationDto,
  })
  async updateReservation(
    @Param('id') reservationId: number,
    @CurrentUser() user: UserPayload,
    @Body() updateReservationForm: UpdateReservationForm,
  ): Promise<ResponseEntity<UpdateReservationDto>> {
    const updateReservationDto =
      await this.reservationService.updateReservation(
        reservationId,
        user.id,
        updateReservationForm,
      );

    return ResponseEntity.ok(updateReservationDto);
  }

  @Auth(UserType.CUSTOMER)
  @Delete(':id')
  @ApiResponseEntity({
    summary: '고객 - 예약 삭제',
    type: Boolean,
  })
  async deleteReservation(
    @Param('id') reservationId: number,
    @CurrentUser() user: UserPayload,
  ): Promise<ResponseEntity<boolean>> {
    await this.reservationService.deleteReservation(reservationId, user.id);

    return ResponseEntity.ok(true);
  }
}
