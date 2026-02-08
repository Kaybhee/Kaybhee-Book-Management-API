import { Inject, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Entity/db.userEntity';
import { SendMailService } from './services/mail.services';
import { JwtModule } from '@nestjs/jwt';
import { BookService } from 'src/book/book.service';
import { Borrow } from 'src/Entity/db.borrowEntity';
import { Books } from 'src/Entity/db.bookEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Books, Borrow]),
    JwtModule.register({
      global : true,
      secret : process.env.JWT_SECRET,
      signOptions: { expiresIn: "60d"}
    }),
  ],
  exports: [UsersService],
  providers: [UsersService, SendMailService, BookService],
  controllers : [UsersController],
})
export class UsersModule {}
