import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Restaurant } from '../entity/restaurant.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { LoginForm } from './forms/login.form';
import { JwtService } from '@nestjs/jwt';
import { UserType } from './enums/user-type.enum';
import { compare } from 'bcrypt';
import { Customer } from '../entity/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * 식당 로그인
   */
  async loginRestaurant(loginForm: LoginForm): Promise<LoginDto> {
    const { email, password } = loginForm;

    const restaurant = await this.restaurantRepository.findOne({
      where: { email: email },
    });

    if (!restaurant) {
      throw new UnauthorizedException('INVALID_LOGIN');
    }

    // hash 비밀번호 체크
    await this._checkPassword(password, restaurant.password);

    const payload = { sub: restaurant.id, type: UserType.RESTAURANT };
    const accessToken = this.jwtService.sign(payload);

    return LoginDto.of({ accessToken: accessToken });
  }

  /**
   * 고객 로그인
   */
  async loginCustomer(loginForm: LoginForm): Promise<LoginDto> {
    const { email, password } = loginForm;

    const customer = await this.customerRepository.findOne({
      where: { email: email },
    });

    if (!customer) {
      throw new UnauthorizedException('INVALID_LOGIN');
    }
    // hash 비밀번호 체크
    await this._checkPassword(password, customer.password);

    const payload = { sub: customer.id, type: UserType.CUSTOMER };
    const accessToken = this.jwtService.sign(payload);

    return LoginDto.of({ accessToken: accessToken });
  }

  /**
   * 비밀번호 체크
   */
  private async _checkPassword(
    formPassword: string,
    checkPassword: string,
  ): Promise<void> {
    const isValid = await compare(formPassword, checkPassword);

    if (!isValid) {
      throw new UnauthorizedException('INVALID_LOGIN');
    }
  }
}
