import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { User } from 'src/Entity/db.entity';
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import NodeCache from 'node-cache';
import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config';
import { SendMailService } from './services/mail.services';
import { hashPass } from './services/password.services';
import { userCreationDTO } from './dto/create.users.dto';
// import { sendMail } from './services/mail.services';
dotenv.config()
const cache = new NodeCache()

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private mailService: SendMailService
    ) {}


    async userCreation(email:string, username : string, password: string, userCreation : userCreationDTO): Promise<any>{
        try {
            const existingUser = await this.userRepository.findOne({
            where : {
                username : username,
                email : email
            }
        })
        if (existingUser) {
            return {
                message : "Username exists",
                status : false,
                data: null
            }
        }

        if (!hashPass(password)) {
            return new Error
        }
        const code = Math.floor(10000 + Math.random() * 900000)
        cache.set<unknown>(email, code.toString(), 3600000);
        // const hash = await bcrypt.hash(password, 10);
        const hashedPassword = await hashPass(userCreation.password)
        const user: User = this.userRepository.create({
            email : userCreation.email,
            username : userCreation.username,
            password : hashedPassword
        })
        if (!user.isVerified) {
            // const token = jwt.sign({ email: user.email}, this.dbConfig.get<string>('JWT_SECRET')!, { expiresIn: '10m'})

            await this.mailService.sendEmail(user.email,
                {
                    subject : "User Confirmation – Books",
                    message : `
                    Kindly verify your account using the OTP codes ${code}
                    `
                }
            )
            }

        return {
            message : "User successfully created",
            data : user,
            code,
        }
    }
    catch (err) {
        console.error(err)
    }
}
}
