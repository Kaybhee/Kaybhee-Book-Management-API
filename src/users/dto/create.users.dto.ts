import { IsNotEmpty, IsString } from "class-validator";



export class userCreationDTO {
    @IsNotEmpty({ message : "The username field cannot be empty"})
    @IsString({ message : "The username must be a string"})
    username : string

    @IsNotEmpty({ message : "The email of the user must not be left empty"})
    @IsString({ message : "The email provided must be a string"})
    email : string

    @IsNotEmpty({ message : "password is required"})
    @IsString({ message : "Password must be a string"})
    password : string

} 