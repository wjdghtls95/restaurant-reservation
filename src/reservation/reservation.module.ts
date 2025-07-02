import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entity/reservation.entity';
import { Customer } from '../entity/customer.entity';
import { Restaurant } from '../entity/restaurant.entity';
import { Menu } from '../entity/menu.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Customer, Restaurant, Menu]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
