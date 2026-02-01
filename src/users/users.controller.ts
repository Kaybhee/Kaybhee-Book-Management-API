import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { userCreationDTO } from './dto/create.users.dto';
import { User } from '../Entity/db.userEntity'
import { UsersService } from './users.service';
import { VerifyUserDto } from './dto/verify.users.dto';
import { UserLogin } from './dto/user.login.dto';
import { ResendUserOtpDto } from './dto/resend-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersServ : UsersService,
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

}


