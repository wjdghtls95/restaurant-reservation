import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseEntity } from 'src/utils/response/response-entity';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 기본값 설정
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 99999;

    // NestJS 기본 HttpException인 경우
    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      statusCode = exception.getStatus();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && (res as any).message) {
        const resObj = res as any;
        message = Array.isArray(resObj.message)
          ? resObj.message.join(', ')
          : resObj.message;
      }

      // 사용자 지정 code가 있으면 사용
      if ((res as any).code) {
        code = (res as any).code;
      }
    }

    response.status(statusCode).json(ResponseEntity.error(code, message));
  }
}
