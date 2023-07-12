import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { ConfigModule } from '@nestjs/config';
import { CorreiosModule } from './correios/correios.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ClientModule,
    ConfigModule.forRoot(),
    CorreiosModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
      }
    }),],
})
export class AppModule { }
