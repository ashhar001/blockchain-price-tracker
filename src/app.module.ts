import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceService } from './price.service';
import { AlertService } from './alert.service';
import { PriceController } from './price.controller';
import { Price } from './entities/price.entity';
import { Alert } from './entities/alert.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Price, Alert],
      synchronize: true, // Automatically synchronize the database schema
    }),
    TypeOrmModule.forFeature([Price, Alert]),
    ScheduleModule.forRoot(),
  ],
  controllers: [PriceController],
  providers: [PriceService, AlertService],
})
export class AppModule {}
