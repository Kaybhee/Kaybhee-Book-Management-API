import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from 'src/Entity/db.bookEntity';
import { Borrow } from 'src/Entity/db.borrowEntity';
import { User } from 'src/Entity/db.userEntity';
import { SendMailService } from 'src/users/services/mail.services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Books, Borrow, User])
  ],
  providers: [BookService, SendMailService],
  controllers: [BookController]
})
export class BookModule {}
