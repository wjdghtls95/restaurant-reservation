import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ExcludeTimeDto } from './exclude-time.dto';

export class BaseOutDto extends ExcludeTimeDto {
  static of<T>(this: ClassConstructor<T>, partial?: Partial<T>): T {
    return plainToInstance(this, partial);
  }
}
