import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../utils/decorator/auth.decorator';
import { MenuService } from './menu.service';
import { CreateMenuForm } from './forms/create-menu.form';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { UserPayload } from '../utils/interface/user-payload.interface';
import { MenuDto } from './dtos/menu.dto';
import { UserType } from '../auth/enums/user-type.enum';
import { GetMenusForm } from './forms/get-menus.form';
import { ApiResponseEntity } from '../utils/response/api-response-entity.decorator';
import { ResponseEntity } from '../utils/response/response-entity';

@Auth(UserType.RESTAURANT)
@ApiTags('Menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiResponseEntity({ summary: '식당 - 메뉴 추가', type: MenuDto })
  async createMenu(
    @CurrentUser() user: UserPayload,
    @Body() createMenuForm: CreateMenuForm,
  ): Promise<ResponseEntity<MenuDto>> {
    const menuDto = await this.menuService.createMenu(user.id, createMenuForm);

    return ResponseEntity.ok(menuDto);
  }

  @Get()
  @ApiResponseEntity({
    summary:
      '식당 - 메뉴 전체 조회 or 이름(일부), 최대 가격, 최소 가격 선택적 검색',
    type: MenuDto,
  })
  async getMenus(
    @CurrentUser() user: UserPayload,
    @Query() getMenusForm: GetMenusForm,
  ): Promise<ResponseEntity<MenuDto[]>> {
    const menuDtos = await this.menuService.getMenus(user.id, getMenusForm);

    return ResponseEntity.ok(menuDtos);
  }

  @Delete(':id')
  @ApiResponseEntity({ summary: '식당 - 메뉴 삭제' })
  async deleteMenu(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.menuService.deleteMenu(user.id, Number(id));
  }
}
