import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as joi from 'joi'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entity/db.entity';

@Module({
  imports: [UsersModule,
    ConfigModule.forRoot({
      isGlobal : true,
      // envFilePath : '.env',
      validationSchema : joi.object({
        DB_HOST : joi.string().required(),
        DB_PORT: joi.number().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_NAME : joi.string().required(),
        APP_PORT : joi.number().required(),
        BREVO_API : joi.string().required(),
        JWT_SECRET : joi.string().required()
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject : [ConfigService],
      useFactory : (config : ConfigService) => ({
        type : 'postgres',
        host : config.get<string>('DB_HOST'),
        port : config.get<number>('DB_PORT'),
        password : config.get<string>('DB_PASSWORD'),
        username : config.get<string>('DB_USERNAME'),
        database : config.get<string>('DB_NAME'),
        entities : [User],
        synchronize : true
      })
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
