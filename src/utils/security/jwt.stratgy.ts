import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserType } from '../../auth/enums/user-type.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: number; type: UserType }) {
    if (!payload?.sub || !payload?.type) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    // 아이디 (식당 id, 고객 id) & 아이디 타입 리턴
    return {
      id: payload.sub, //
      type: payload.type,
    };
  }
}
