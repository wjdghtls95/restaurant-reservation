import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setUpSwagger } from './utils/swagger';
import { HttpExceptionFilter } from './utils/filter/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // dto 유효성 검사용 global pipe 설정
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 전역 예외 필터 등록
  app.useGlobalFilters(new HttpExceptionFilter());

  // swagger 초기화
  setUpSwagger(app);

  // 서버 실행
  const port = process.env.SERVER_PORT || 3000;
  Logger.log(`Server started on port: ${port}`);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
