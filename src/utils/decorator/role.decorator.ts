import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../auth/user-type.enum';

export const Role = (role: UserType) => SetMetadata('role', role);
