import { Column, Entity, OneToMany } from 'typeorm';
import { Menu } from './menu.entity';
import { Reservation } from './reservation.entity';
import { AbstractEntity } from './abstract.entity';

@Entity('restaurants')
export class Restaurant extends AbstractEntity {
  @Column({ comment: '식당 이름' })
  name: string;

  @Column({ unique: true, comment: '식당 로그인 아이디' })
  email: string;

  @Column({ comment: '식당 로그인 비밀번호' })
  password: string;

  @OneToMany(() => Menu, (menu: Menu) => menu.restaurant)
  menus: Menu[];

  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.restaurant,
  )
  reservations: Reservation[];
}
