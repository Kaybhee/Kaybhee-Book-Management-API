import { HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code, Repository } from 'typeorm'
import { User } from 'src/Entity/db.entity';
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import NodeCache from 'node-cache';
import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config';
import { SendMailService } from './services/mail.services';
import { hashPass, verifyUserPassword } from './services/password.services';
import { userCreationDTO } from './dto/create.users.dto';
import { VerifyUser } from './dto/verify.users.dto';
import { signUser } from './services/token.services';
import { UserLogin } from './dto/user.login.dto';
import { console } from 'inspector';
// import { sendMail } from './services/mail.services';
dotenv.config()
const cache = new NodeCache()

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: SendMailService,
        private readonly tokenService : signUser
    ) {}


    async userCreation(createUser : userCreationDTO): Promise<any>{
        try {
            const existingUser = await this.userRepository.findOne({
            where : [
                {username : createUser.username},
                {email : createUser.email}
            ]
        })
        if (existingUser) {
            return {
                message : "Username or email exists",
                status : HttpStatus.CONFLICT,
                data: null
            }
        }

        const code = Math.ceil(10000 + Math.random() * 900000)
        cache.set<string>(createUser.email, code.toString(), 3600000);
        // const hash = await bcrypt.hash(password, 10);
        const hashedPassword = await hashPass(createUser.password)
        const user: User = this.userRepository.create({
            email : createUser.email,
            username : createUser.username,
            password : hashedPassword
        })
        await this.userRepository.save(user)

        if (!user.isVerified) {
            // const token = jwt.sign({ email: user.email}, this.dbConfig.get<string>('JWT_SECRET')!, { expiresIn: '10m'})

            await this.mailService.sendEmail(user.email,
                {
                    subject : "User Confirmation – Books",
                    message : `
                    Kindly verify your account using the OTP this code - ${code}
                    `
                }
            )
            }
            return {
                message : "User created successfully",
                data : user,
                code
            }
    }
    catch (err) {
        console.error(err)
        return {
            status : HttpStatus.SERVICE_UNAVAILABLE,
            message : "Internal Server error",
        }
    }
}

async verifyUserEmail( userVerification : VerifyUser) {
    const userEmail = await this.userRepository.findOne({
        where :
        {email : userVerification.email}
    })

    if (!userEmail) {
        throw new NotFoundException("This email does not exist")
    }

    const cachedCode = cache.get<string>(userVerification.email)
    if (cachedCode !== userVerification.code) {
        return {
            status : HttpStatus.FORBIDDEN,
            message : "Invalid verification code",
            data : null
        }
    }
    else if (userEmail.isVerified){
        return {
            status : HttpStatus.FOUND,
            message : "Email has already been verified",
            data : null
        } 
    }
    userEmail.isVerified = true;
    const isSaved = await this.userRepository.save(userEmail)
    console.log("This is the saved verified user", isSaved)
    return {
        status : HttpStatus.OK,
        message : "User verified successfully",
        data : isSaved
    }

}

async userLogin(loginCred : UserLogin) {
    const user = await this.userRepository.findOne({ where : {email : loginCred.email}})
    console.log("This is the user", user)
    if (!user) {
        return {
            message : "This email does not exist",
            status : HttpStatus.NO_CONTENT,
            data : null
        }
    }
    const match = await verifyUserPassword(loginCred.password, user.password)
    console.log("The input password", loginCred.password)
    console.log("This is the oassword to this account",user.password)
    if(!match) {
        throw new Error("The password is incorrect")
    }
    
    if (!user.isVerified) {
        const code = Math.ceil(10000 + Math.random() * 900000)
        cache.set<unknown>(user.email, code.toString(), 3600000)
        const sendOtp = await this.mailService.sendEmail(
            user.email,
            { subject: "User Verification for Books", message : `
                This account has not been verified. Kindly use this code – ${code} to get verified`}
        )

        if (!sendOtp) {
            return {
                status : HttpStatus.BAD_REQUEST,
                message : "Email not sent",
                data : null
            }
        }
        return {
            status : HttpStatus.CONTINUE,
            message : "This User has not verified his account. A mail has been sent with an OTP for verification",
            data : null
        }
    }
    
    const userToken = await this.tokenService.userSignInToken(user)
    // console.log(user)
    return {
        status : HttpStatus.OK,
        message : "User logged in Successfully",
        data : {
            user, token : userToken

        }
    }

}

     
}


