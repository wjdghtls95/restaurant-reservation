import { Entity, Column, OneToMany } from 'typeorm';
import { Reservation } from './reservation.entity';
import { AbstractEntity } from './abstract.entity';

@Entity('customers')
export class Customer extends AbstractEntity {
  @Column({ comment: '고객 이름' })
  name: string;

  @Column({ unique: true, comment: '고객 로그인 아이디' })
  email: string;

  @Column({ comment: '고객 비밀번호 (해시된 값)' })
  password: string;

  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations: Reservation[];
}
