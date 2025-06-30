import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHealth(): Promise<Record<string, unknown>> {
    return { env: process.env.NODE_ENV };
  }
}
