import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
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
import { BorrowBooksDto } from './book.dto/borrow.book.dto';
import { Borrow } from 'src/Entity/db.borrowEntity';
import { SendMailService } from 'src/users/services/mail.services';
import { User } from 'src/Entity/db.userEntity';

@Injectable()
export class BookService {
        constructor(
            @InjectRepository(Books)
            private readonly bookRepository: Repository<Books>,
            @InjectRepository(Borrow)
            private readonly borrowRepository: Repository<Borrow>,
                @InjectRepository(User)
                private readonly userRepository: Repository<User>,
            private readonly mail: SendMailService
    ){}
    
    async bookCreation(createBooks: BookCreationDto): Promise<any> {
        try {
        
            const existingBookByISBN = await this.bookRepository.findOne({
                where: { ISBN: createBooks.ISBN}
            })
            const existingBookByTitle = await this.bookRepository.findOne({
                where: { Title: createBooks.Title}
            })


            if(existingBookByISBN){
                throw new ConflictException("The book with the ISBN already exist")
            }


            if(existingBookByTitle){
                if(existingBookByTitle.Author !== createBooks.Author){
                    throw new ConflictException(
                        `A book with the title "${createBooks.Title}" has already been published by "${existingBookByTitle.Author}". An author cannot publish a book with a title that another author has already published.`
                    )
                // } else if (existingBookByTitle.Author == createBooks.Author && existingBookByTitle.Edition !== createBooks.Edition) {
                }
                const books: Books = this.bookRepository.create({
                    ISBN: createBooks.ISBN,
                    Title: createBooks.Title,
                    Author: createBooks.Author,
                    Edition : createBooks.Edition,
                    Publisher : createBooks.Publisher,
                    Genre : createBooks.Genre
                })
                books.isAvailable = true
                const savedbooks = await this.bookRepository.save(books)
                return {
                    status: HttpStatus.CREATED,
                    message: `Book with the serial no ${createBooks.ISBN} and the author ${createBooks.Author} has been created`,
                    data: savedbooks
                }
                }
                // else {
                //     throw new ConflictException(
                //         `You have already published a book with the title "${createBooks.Title}"`
                //     )
                // }

                else {
                    const books: Books = this.bookRepository.create({
                        ISBN: createBooks.ISBN,
                        Title: createBooks.Title,
                        Author: createBooks.Author,
                        Edition : createBooks.Edition,
                        Genre : createBooks.Genre,
                        Publisher : createBooks.Publisher
                    })
                    
                    const savedbooks = await this.bookRepository.save(books)
                    return {
                        status: HttpStatus.CREATED,
                        message: `Book with the serial no ${createBooks.ISBN} and the author ${createBooks.Author} has been created`,
                        data: savedbooks
                    }
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

    async updateBook(id : number, updateContent : updateBookContentDto, Title?: string, ISBN?: string, Author?: string): Promise<any> {
        
        try{
            // const existingAuthor = await this.bookRepository.findOneBy([{Title}, {ISBN}, {Author}])
            const existingAuthor = Title || ISBN || Author
            if (existingAuthor) {
                throw new ForbiddenException("You are not allowed to do that")
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

    async getABook(id : number): Promise<Books> {
        const book = await this.bookRepository.findOneBy({id})
        if (!book) {
            throw new NotFoundException(`The Id ${id} does not exist`)
        }
        return book
    }
    
    async borrowBook(userId: number, bookDto : BorrowBooksDto): Promise<Books | object>{
        
        const activeBorrow = await this.borrowRepository.findOne({
            where: {user: { userId: userId}, isReturned: false},
            relations: ['user', 'book']
        })
        if (activeBorrow){
            const today = new Date()
            if (today > activeBorrow.returnDate){
                const lateDays = Math.ceil((today.getTime() - activeBorrow.returnDate.getTime()) / (1000 * 60 * 60 * 60)) //1 hour
                const fine = lateDays * 100;

                return {
                    status: HttpStatus.FORBIDDEN,
                    message: `${await this.mail.sendEmail(activeBorrow.user?.email, {message: `You must return the previous book. A fine of ₦${fine} has been incurred`, subject: "Book Return Date Exceeded"}
                    )}`
                }
            }
            throw new ForbiddenException("You must return the previous book before borrowing another.")
        }
        // const user = await this.userRepository.findOne({
        //     where: {userId}
        // })

        const bookRequest = await this.bookRepository.findOne({ where:
            { id: bookDto.bookId, isAvailable: true}
        })

        if (!bookRequest){
            throw new NotFoundException("We donot have the requested book")
        }

        // load user entity to get email and other properties
        const user = await this.userRepository.findOne({ where: { userId } as any })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const bookBorrowed: Borrow = this.borrowRepository.create({
            user: user as any,
            book: bookRequest,
            returnDate: bookDto.returnDate
        })

        if (!bookBorrowed){
            throw new BadRequestException()
        }

        await this.mail.sendEmail(user.email, 
           { 
            subject: "Borrowing Confirmation",
            message: `Book successfully borrowed, authored by ${bookRequest.Author} with the title ${bookRequest.Title}. This book has to be returned on the ${bookBorrowed.returnDate}`
           }
        )
        const savedBorrowed = await this.borrowRepository.save(bookBorrowed)
        bookRequest.isAvailable = false
        await this.bookRepository.save(bookRequest)
        return savedBorrowed
    }

    async returnBook(borrowId: number ): Promise<Borrow | any> {
        if (!Number.isInteger(borrowId) || borrowId <= 0) {
            throw new BadRequestException("Invalid borrowId: must be a positive integer")
        }

        const returnBook = await this.borrowRepository.findOne({
            where:
            {id: borrowId, isReturned: false},
            relations: ['book', 'user']
        })
    
        if (!returnBook) {
            throw new NotFoundException(`The borrow record with ID ${borrowId} does not exist or has already been returned`)
        }

        const todaysDate = new Date()

        if(todaysDate > returnBook.returnDate) {
            const diffDays = Math.ceil(todaysDate.getTime() - returnBook.returnDate.getTime()) / (1000 * 60 * 60 * 24) // 24 hours
            returnBook.fine = diffDays*100
            return {
                status: HttpStatus.FORBIDDEN,
                message: await this.mail.sendEmail(returnBook.user?.email, { message: `To return the book, a fine of ₦${returnBook.fine} must be repayed.`, subject: "Payment of Fine For Return Date Defaulters"} )
            }
        }

        returnBook.isReturned = true;
        returnBook.returnedAt = new Date();

        await this.borrowRepository.save(returnBook)
        returnBook.book.isAvailable = true

        await this.bookRepository.save(returnBook.book)

        return returnBook

    }

    async checkUserHistory(userId: number) {
        const userHistory = await this.borrowRepository.find({
            where: {user: { userId: userId }},
            relations: [ 'user','book'],
            order: {borrowedAt:  'DESC'}
        })

        const userName = userHistory.length > 0? userHistory[0].user.username : null
        if(userName === null){
            throw new NotFoundException(`The id ${userId} does not exist`)
        }
        const history = userHistory.map(({user, ...removeUser}) => removeUser)
        // userHistory./
        console.log(userId)
        return {
            status: HttpStatus.OK,
            message: `User history for ${userName} returned successfully`,
            data: history
        }
    }
}
