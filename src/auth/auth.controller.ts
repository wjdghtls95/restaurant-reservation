import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginForm } from './forms/login.form';
import { LoginDto } from './dtos/login.dto';
import { ApiResponseEntity } from '../utils/response/api-response-entity.decorator';
import { ResponseEntity } from '../utils/response/response-entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('restaurant/login')
  @ApiResponseEntity({ summary: '식당 로그인', type: LoginDto })
  async loginRestaurant(
    @Body() loginForm: LoginForm,
  ): Promise<ResponseEntity<LoginDto>> {
    const loginDto = await this.authService.loginRestaurant(loginForm);

    return ResponseEntity.ok(loginDto);
  }

  @Post('customer/login')
  @ApiResponseEntity({ summary: '고객 로그인', type: LoginDto })
  async loginCustomer(
    @Body() loginForm: LoginForm,
  ): Promise<ResponseEntity<LoginDto>> {
    const loginDto = await this.authService.loginCustomer(loginForm);

    return ResponseEntity.ok(loginDto);
  }
}
