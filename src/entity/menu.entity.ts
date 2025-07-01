import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { MenuCategory } from '../menu/menu-category.enum';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '메뉴 이름' })
  name: string;

  @Column({ comment: '메뉴 설명' })
  description: string;

  @Column({ comment: '메뉴 가격' })
  price: number;

  @Column({ comment: '메뉴 카테고리', type: 'enum', enum: MenuCategory })
  category: MenuCategory;

  @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.menus)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
