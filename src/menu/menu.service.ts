import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entity/menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuForm } from './forms/create-menu.form';
import { MenuDto } from './dtos/menu.dto';
import { GetMenusForm } from './forms/get-menus.form';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  /**
   * 메뉴 생성
   */
  async createMenu(
    userId: number,
    createMenuForm: CreateMenuForm,
  ): Promise<MenuDto> {
    const newMenu = this.menuRepository.create({
      ...createMenuForm,
      restaurant: { id: userId },
    });

    await this.menuRepository.save(newMenu);

    return MenuDto.of(newMenu);
  }

  /**
   * 메뉴 조회
   */
  async getMenus(
    userId: number,
    getMenusForm: GetMenusForm,
  ): Promise<MenuDto[]> {
    const qb = this.menuRepository
      .createQueryBuilder('menus')
      .where('menus.restaurant_id=:restaurantId', {
        restaurantId: userId,
      });

    const { name, minPrice, maxPrice } = getMenusForm;

    if (name) {
      qb.andWhere('menus.name LIKE :name', { name: `%${name}%` });
    }

    if (minPrice !== undefined) {
      qb.andWhere('menus.price>=:minPrice', { minPrice: minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('menus.price<=:maxPrice', { maxPrice: maxPrice });
    }

    const menus = await qb.getMany();

    return menus.map(MenuDto.of);
  }

  /**
   * 메뉴 삭제
   */
  async deleteMenu(userId: number, menuId: number): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId, restaurant: { id: userId } },
    });

    if (!menu) {
      throw new NotFoundException('NOT_FOUND_MENU');
    }

    await this.menuRepository.delete(menuId);
  }
}
