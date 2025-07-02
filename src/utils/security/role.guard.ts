import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserType } from '../../auth/enums/user-type.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userType = this.reflector.get<UserType>('role', context.getHandler());

    // auth decorator에 role이 없으면 true로 role guard 종료
    if (!userType) return true;

    const { user } = context.switchToHttp().getRequest();

    if (user?.type !== userType) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    return true;
  }
}
