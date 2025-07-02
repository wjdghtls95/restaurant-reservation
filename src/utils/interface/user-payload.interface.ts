import { UserType } from '../../auth/enums/user-type.enum';

export interface UserPayload {
  id: number;
  type: UserType;
}
