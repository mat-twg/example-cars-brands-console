import { Module } from '@nestjs/common';
import { BrandsCommand } from './commands/brands.command';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CarsCommand } from './commands/cars.command';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    HttpModule.register({ baseURL: process.env.BASE_URL }),
  ],
  providers: [BrandsCommand, CarsCommand],
})
export class AppModule {}
