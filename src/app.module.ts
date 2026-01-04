import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as joi from 'joi'
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

@Module({
  imports: [UsersModule,
    ConfigModule.forRoot({
      isGlobal : true,
      validationSchema : joi.object({
        DB_HOST : joi.string().required(),
        DB_PORT: joi.number().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required()
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject : [ConfigService],
      useFactory : (config : ConfigService) => ({
        type : 'postgres',
        host : config.get<string>('DB_HOST'),
        port : config.get<number>('DB_PORT')
      })
    })
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
