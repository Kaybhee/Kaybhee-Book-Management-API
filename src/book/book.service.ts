import { ConflictException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { Books } from 'src/Entity/db.bookEntity';
import { BookCreationDto } from './book.dto/books.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { GetBooksDto } from 'src/users/dto/getBooks.dto';
import { create } from 'domain';
import { error } from 'console';
import { PaginationDto } from './book.dto/pagination.dto';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { updateBookContentDto } from './book.dto/updateBook.dto';

@Injectable()
export class BookService {
        constructor(
            @InjectRepository(Books)
            private readonly bookRepository: Repository<Books>
    ){}
    
    async bookCreation(createBooks: BookCreationDto): Promise<any> {
        try {
        
            const existingBookByISBN = await this.bookRepository.findOne({
                where: { ISBN: createBooks.ISBN}
            })

            if(existingBookByISBN){
                throw new ConflictException("The book with the ISBN already exist")
            }

            const existingBookByTitle = await this.bookRepository.findOne({
                where: { Title: createBooks.Title}
            })

            if(existingBookByTitle){
                if(existingBookByTitle.Author !== createBooks.Author){
                    throw new ConflictException(
                        `A book with the title "${createBooks.Title}" has already been published by "${existingBookByTitle.Author}". An author cannot publish a book with a title that another author has already published.`
                    )
                } else if (existingBookByTitle.Author == createBooks.Author && existingBookByTitle.Edition !== createBooks.Edition) {
                    const books: Books = this.bookRepository.create({
                    ISBN: createBooks.ISBN,
                    Title: createBooks.Title,
                    Author: createBooks.Author,
                    Edition : createBooks.Edition,
                    Publisher : createBooks.Publisher
                    // Genre : createBooks.Genre
                })
                const savedbooks = await this.bookRepository.save(books)
                return {
                    status: HttpStatus.CREATED,
                    message: `Book with the serial no "${createBooks.ISBN}" and the author "${createBooks.Author}" has been created`,
                    data: savedbooks
                }
                }
                else {
                    throw new ConflictException(
                        `You have already published a book with the title "${createBooks.Title}"`
                    )
                }
            }

            const books: Books = this.bookRepository.create({
                ISBN: createBooks.ISBN,
                Title: createBooks.Title,
                Author: createBooks.Author,
                Edition : createBooks.Edition,
                Genre : createBooks.Genre
            })

            const savedbooks = await this.bookRepository.save(books)
            return {
                status: HttpStatus.CREATED,
                message: `Book with the serial no "${createBooks.ISBN}" and the author "${createBooks.Author}" has been created`,
                data: savedbooks
            }
        } catch (err) {
            console.error('Server error', err)
            throw err
        }
    }

    // async getAllBooks(paginatedResponse : PaginationDto) {
    //     const { offset=1, limit=10 }= paginatedResponse;
    //     const [books, totalDocs] = await this.bookRepository.findAndCount({
    //         take : limit,
    //         skip : offset
    //     })
    //     const boo = await this.bookRepository.find()
    //     console.log(boo)
    //     console.log(books)

    //     return {
    //         data : books,
    //         count : totalDocs,
    //         limit,
    //         offset,
    //         nextPage : totalDocs > limit + offset ? limit + offset : null
    //     }
    // }

    async getAllBooks(options: IPaginationOptions): Promise<Pagination<Books>> {
        return paginate<Books>(this.bookRepository, options)
    }

    async getABook(id : number, updateContent : updateBookContentDto, Title?: string, ISBN?: string, Author?: string): Promise<any> {
        
        try{
            const existingAuthor = await this.bookRepository.findOneBy([{Title}, {ISBN}, {Author}])
            if (existingAuthor) {
                throw new ForbiddenException()
            }
            const bookIndex = await this.bookRepository.findOneBy({id})
            if (!bookIndex) {
                throw new NotFoundException("This index cannot be found")
            }

            bookIndex.Genre = updateContent.Genre || bookIndex.Genre
            bookIndex.Edition = updateContent.Edition || bookIndex.Edition
            bookIndex.Publisher = updateContent.Publisher || bookIndex.Publisher


            return this.bookRepository.save(bookIndex)
        }
        catch (err){
            console.error('Server Error', err)
            throw new InternalServerErrorException()
        }
    }
}
