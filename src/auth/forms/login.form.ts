import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginForm {
  @ApiProperty({ description: '로그인 아이디' })
  @IsString()
  email: string;

  @ApiProperty({ description: '로그인 비밀번호' })
  @IsString()
  password: string;
}
