import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeormConfig } from './utils/typeorm';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeormConfig,
    }),

    // Domain Module
    AuthModule,
    MenuModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
