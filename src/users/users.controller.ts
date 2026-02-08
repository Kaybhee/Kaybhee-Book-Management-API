import { Controller, HttpCode, HttpStatus, Post, Param, Get, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { userCreationDTO } from './dto/create.users.dto';
import { User } from '../Entity/db.userEntity'
import { UsersService } from './users.service';
import { VerifyUserDto } from './dto/verify.users.dto';
import { UserLogin } from './dto/user.login.dto';
import { ResendUserOtpDto } from './dto/resend-user.dto';
import { BookService } from 'src/book/book.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './Roles/role.guard';
import { Roles } from './Roles/roles.decorator';
import { Role } from './Roles/enum.roles';

@Controller('users')
export class UsersController {
    constructor(
        private readonly UsersServ : UsersService,
        private readonly userHistory : BookService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createUser( @Body() userCred : userCreationDTO): Promise<User> {
        return this.UsersServ.userCreation(userCred)
    }

    @Post('resend-user')
    @HttpCode(HttpStatus.OK)
    resendUser(@Body() resend: ResendUserOtpDto): Promise<any> {
        const email = this.UsersServ.resendUserOtp(resend)
        return email
    }


    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    verifyUserEmail(@Body() verify: VerifyUserDto): Promise<any> {
        return this.UsersServ.verifyUserEmail(verify)
    }

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    userLogin(@Body() userLogin : UserLogin): Promise<any> {
        return this.UsersServ.userLogin(userLogin)

    }

    @Get('history/:userId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.USER)
    @HttpCode(HttpStatus.OK)
    async checkUserHistory(@Param('userId', ParseIntPipe) userId: number) {
        console.log(userId);
        
        const _userData = await this.userHistory.checkUserHistory(userId)
        return _userData
    }
}


