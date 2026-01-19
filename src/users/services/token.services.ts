import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import jwt  from "jsonwebtoken";
import { Repository } from 'typeorm'
import { User } from "src/Entity/db.entity";

@Injectable()
// export class Auth {
//     async AdminServices (id : number, ) {

//     }
// }


export class signUser {
    constructor (
    //     private readonly user : Repository<User>,
        private readonly config : ConfigService
    ){}
    async userSignInToken (user: any) {
    const token = jwt.sign({id : user.id}, this.config.get<string>('JWT_SECRET')!, { expiresIn : '60d'})
    return token
}}