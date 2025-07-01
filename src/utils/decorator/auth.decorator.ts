import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../security/jwt.guard';
import { UserType } from '../../auth/user-type.enum';
import { RoleGuard } from '../security/role.guard';
import { Role } from './role.decorator';

export function Auth(role?: UserType): MethodDecorator & ClassDecorator {
  const decorators = [
    UseGuards(JwtAuthGuard, RoleGuard),
    ApiBearerAuth('access-token'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  ];

  // Auth decorator 에 role 이 있으면 push
  if (role) {
    decorators.push(Role(role));
  }

  return applyDecorators(...decorators);
}
