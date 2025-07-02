import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseEntity<T> {
  @ApiProperty({ example: 0, description: '응답 코드 (0=성공, 나머지=실패)' })
  readonly code: number;

  @ApiPropertyOptional({ description: '응답 데이터' })
  readonly data?: T | T[];

  @ApiPropertyOptional({ description: '응답 메시지 (예: 오류 사유)' })
  readonly message?: string;

  @ApiPropertyOptional({ description: '추가 정보 (예: pagination)' })
  readonly payLoad?: object;

  constructor(
    code: number,
    data?: T | T[],
    message?: string,
    payLoad?: object,
  ) {
    this.code = code;
    this.data = data;
    this.message = message;
    this.payLoad = payLoad;
  }

  static ok<T>(data: T): ResponseEntity<T>;
  static ok<T>(data: T[]): ResponseEntity<T[]>;
  static ok<T>(data: T | T[]): ResponseEntity<T | T[]> {
    return new ResponseEntity(0, data);
  }

  static error<T>(code = 99999, message = 'Unknown Error'): ResponseEntity<T> {
    return new ResponseEntity(code, undefined, message);
  }
}
