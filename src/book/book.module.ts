import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from 'src/Entity/db.bookEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Books])
  ],
  providers: [BookService],
  controllers: [BookController]
})
export class BookModule {}
