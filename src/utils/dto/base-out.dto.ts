import { ClassConstructor, plainToInstance } from 'class-transformer';

export class BaseOutDto {
  static of<T>(this: ClassConstructor<T>, partial?: Partial<T>): T {
    return plainToInstance(this, partial);
  }
}
