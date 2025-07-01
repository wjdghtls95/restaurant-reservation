import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @ApiOperation({ summary: '헬스 체크' })
  async getHealth(): Promise<Record<string, unknown>> {
    return await this.appService.getHealth();
  }
}
