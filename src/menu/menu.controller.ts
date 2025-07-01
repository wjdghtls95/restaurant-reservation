import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../utils/decorator/auth.decorator';
import { MenuService } from './menu.service';
import { CreateMenuForm } from './create-menu.form';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { UserPayload } from '../utils/interface/user-payload.interface';
import { MenuDto } from './menu.dto';
import { UserType } from '../auth/user-type.enum';
import { GetMenusForm } from './get-menus.form';

@Auth(UserType.RESTAURANT)
@ApiTags('Menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '식당 - 메뉴 추가' })
  async createMenu(
    @CurrentUser() user: UserPayload,
    @Body() createMenuForm: CreateMenuForm,
  ): Promise<MenuDto> {
    const menuDto = await this.menuService.createMenu(user.id, createMenuForm);

    return menuDto;
  }

  @Get()
  @ApiOperation({
    summary: '식당 - 메뉴 조회 (이름(일부) 검색, 최대 최소 가격 검색)',
  })
  async getMenus(
    @CurrentUser() user: UserPayload,
    @Query() getMenusForm: GetMenusForm,
  ): Promise<MenuDto[]> {
    const menuDto = await this.menuService.getMenus(user.id, getMenusForm);

    return menuDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: '식당 - 메뉴 삭제' })
  async deleteMenu(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.menuService.deleteMenu(user.id, Number(id));
  }
}
