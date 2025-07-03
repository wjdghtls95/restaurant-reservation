import { Column, Entity, ManyToOne } from 'typeorm';
import { Customer } from './customer.entity';
import { Restaurant } from './restaurant.entity';
import { AbstractEntity } from './abstract.entity';

@Entity('reservations')
export class Reservation extends AbstractEntity {
  @ManyToOne(() => Customer, (customer) => customer.reservations)
  customer: Customer;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
  restaurant: Restaurant;

  @Column({ type: 'datetime', comment: '예약 시작 시간' })
  startTime: Date;

  @Column({ type: 'datetime', comment: '예약 종료 시간' })
  endTime: Date;

  @Column({ comment: '고객 전화번호' })
  phoneNumber: string;

  @Column({ comment: '예약 인원 수' })
  peopleCount: number;

  @Column('json', { nullable: true, comment: '주문 메뉴 아이디들' })
  menuIds: number[];
}
