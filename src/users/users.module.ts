import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Entity/db.entity';
import { SendMailService } from './services/mail.services';
import { signUser } from './services/token.services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UsersService, SendMailService, signUser],
  controllers : [UsersController],
})
export class UsersModule {}
