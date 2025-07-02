import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { MenuCategory } from '../menu/enums/menu-category.enum';
import { AbstractEntity } from './abstract.entity';

@Entity('menus')
export class Menu extends AbstractEntity {
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
