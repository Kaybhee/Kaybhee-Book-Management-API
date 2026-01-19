import { IsNotEmpty, IsString, Length, Matches } from "class-validator";


export class UserLogin {
    @IsNotEmpty({ message : "The email field cannot be empty"})
    @IsString({ message : "The email must be a string"})
    email : string

    @IsString({ message : "This password must be a string"})
    @IsNotEmpty({message : "This password cannot be empty"})
    @Length(8, 20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
        {
            message : 'Password must contain uppercase, lowercase, number, and special character'
        }

    )
    password : string
}