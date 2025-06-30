import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setUpSwagger } from './utils/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // DTO 유효성 검사용 global pipe 설정
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // swagger 초기화
  setUpSwagger(app);

  // 서버 실행
  const port = process.env.SERVER_PORT || 3000;

  Logger.log(`Server started on port: ${port}`);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
