import { UserType } from '../../auth/user-type.enum';

export interface UserPayload {
  id: number;
  type: UserType;
}
