import { IsNotEmpty, IsString, Length } from "class-validator";


export class VerifyUser {
    @IsNotEmpty({ message : "The email field cannot be left empty"})
    @IsString({ message : "The email must be a string"})
    email : string

    @IsString({ message : "The OTP code has to be a string"})
    @IsNotEmpty({ message : "The OTP code field cannot be empty"})
    @Length(6, 7)
    code : string

}