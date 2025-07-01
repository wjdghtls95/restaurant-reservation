import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '../utils/dto/base-out.dto';
import { MenuCategory } from './menu-category.enum';

export class MenuDto extends BaseOutDto {
  @ApiProperty({ description: '메뉴 ID' })
  id: number;

  @ApiProperty({ description: '메뉴 이름' })
  name: string;

  @ApiProperty({ description: '메뉴 설명' })
  description: string;

  @ApiProperty({ description: '메뉴 가격' })
  price: number;

  @ApiProperty({ enum: MenuCategory, description: '메뉴 카테고리' })
  category: MenuCategory;
}
