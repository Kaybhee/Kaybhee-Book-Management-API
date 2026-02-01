import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Books } from 'src/Entity/db.bookEntity';
import { BookCreationDto } from './book.dto/books.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { create } from 'domain';
import { error } from 'console';

@Injectable()
export class BookService {
        constructor(
            @InjectRepository(Books)
            private readonly bookRepository: Repository<Books>
    ){}
    
    async bookCreation(createBooks: BookCreationDto): Promise<any> {
        try {
            const existingBooks = await this.bookRepository.findOne({
                where: [
                    { ISBN: createBooks.ISBN},
                    { ISSN: createBooks.ISSN},
                    // {bookName: createBooks.bookName}
                ]
            })

            if(existingBooks){
                throw new ConflictException("The book with the ISSN or ISBN already exist")
            }

            const books: Books = this.bookRepository.create({
                ISSN: createBooks.ISSN,
                ISBN: createBooks.ISBN,
                bookName: createBooks.bookName,
                Author: createBooks.Author
            })

            const savedbooks = await this.bookRepository.save(books)
            return {
                status: HttpStatus.CREATED,
                message: `Book with the serial no "${createBooks.ISSN}" and the author "${createBooks.Author}" has been created`,
                data: savedbooks
            }
        } catch (err) {
            console.error('Server error', err)
            throw err
        }
    }
    }
