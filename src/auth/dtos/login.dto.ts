import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '../../utils/dto/base-out.dto';

export class LoginDto extends BaseOutDto {
  @ApiProperty({ description: 'jwt 액세스 토큰' })
  accessToken: string;
}
