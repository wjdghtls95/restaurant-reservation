import { Exclude } from 'class-transformer';
import { BaseDto } from './base.dto';

export class ExcludeTimeDto extends BaseDto {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
