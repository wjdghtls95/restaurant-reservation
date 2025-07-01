import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '식당 이름' })
  name: string;

  @Column({ unique: true, comment: '식당 로그인 계정 ID (중복 불가)' })
  username: string;

  @Column({ comment: '식당 로그인 비밀번호 (원칙상 암호화 저장)' })
  password: string;

  @OneToMany(() => Menu, (menu: Menu) => menu.restaurant)
  menus: Menu[];
}
