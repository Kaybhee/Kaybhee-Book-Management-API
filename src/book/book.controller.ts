import { Body, Controller, Get, Query, HttpStatus, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Put, Param, Req } from '@nestjs/common';
import { BookCreationDto } from './book.dto/books.dto';
import { AuthGuard } from 'src/users/auth.guard';
import { RolesGuard } from 'src/users/Roles/role.guard';
import { Role } from 'src/users/Roles/enum.roles';
import { Roles } from '../users/Roles/roles.decorator'
import { BookService } from './book.service';
import { PaginationDto } from './book.dto/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Books } from 'src/Entity/db.bookEntity';
import { updateBookContentDto } from './book.dto/updateBook.dto';
import { BorrowBooksDto } from './book.dto/borrow.book.dto';


@Controller('book')
export class BookController {
    constructor( private readonly booksCreation : BookService){}
    @Post('book-creation')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createBooks(@Body() books: BookCreationDto) {
        const _data = await this.booksCreation.bookCreation(books)
        return _data
    }


    @Get()
    async getAllBooks( 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number=1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number=10
) : Promise<Pagination<Books>> {
    limit = limit > 100 ? 100 : limit
    return this.booksCreation.getAllBooks({
        page,
        limit
    })
}


@Put('update/:id')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
async updateBook(@Param('id', ParseIntPipe) id : number, @Body()updateContent : updateBookContentDto): Promise<Books | object> {
    const bookUpdate = await this.booksCreation.updateBook(id, updateContent);
    return {
        message: "The books have been successfully updated",
        status: HttpStatus.OK,
        data: bookUpdate
    }


}

@Get('a-book/:id')
async getABook(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const book = await this.booksCreation.getABook(id)
    console.log(book);
    
    return {
        message : `The book with Id:${id} has been retrieved`,
        status : HttpStatus.OK,
        data : book
    }
}

@Post('borrow-book')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.USER)
async borrowBook(@Req() req, @Body() borrowingBooks: BorrowBooksDto): Promise<Books | unknown>{
    const _borrData = await this.booksCreation.borrowBook(req.user.sub, borrowingBooks)
    return {
            status: HttpStatus.OK,
            message: `Book borrowed successfully, to be returned by ${borrowingBooks.returnDate}`,
            data: _borrData
        }
}

@Post()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.USER)
async returnBook(@Req() id: number) {
    const _returned = await this.returnBook(id)
}
}
