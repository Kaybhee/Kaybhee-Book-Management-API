import { Body, Controller, Get, Query, HttpStatus, Post, UseGuards, DefaultValuePipe, ParseIntPipe, Put, Param } from '@nestjs/common';
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
import { number } from 'joi';
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

@Put('update')
async findABook(@Param('id', ParseIntPipe) id : number, @Body()updateContent : updateBookContentDto): Promise<Books | object> {
    const bookUpdate = await this.booksCreation.getABook(id, updateContent);
    return {
        message: "The books have been successfully updated",
        status: HttpStatus.OK,
        data: bookUpdate
    }

}
}
