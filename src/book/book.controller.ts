import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { BookCreationDto } from './book.dto/books.dto';
import { AuthGuard } from 'src/users/auth.guard';
import { RolesGuard } from 'src/users/Roles/role.guard';
import { Role } from 'src/users/Roles/enum.roles';
import { Roles } from '../users/Roles/roles.decorator'
import { BookService } from './book.service';
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
}
