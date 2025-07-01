import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { MenuCategory } from './menu-category.enum';

export class CreateMenuForm {
  @ApiProperty({
    description: '메뉴 이름',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '메뉴 가격',
  })
  @IsInt()
  price: number;

  @ApiProperty({
    description: '메뉴 카테고리',
    enum: MenuCategory,
    example: MenuCategory.KOREAN,
  })
  @IsEnum(MenuCategory)
  category: MenuCategory;

  @ApiProperty({
    description: '메뉴 설명',
  })
  @IsString()
  description: string;
}
