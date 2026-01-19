import { IsNotEmpty, IsString, Length, Matches } from "class-validator";



export class userCreationDTO {
    @IsNotEmpty({ message : "The username field cannot be empty"})
    @IsString({ message : "The username must be a string"})
    username : string

    @IsNotEmpty({ message : "The email of the user must not be left empty"})
    @IsString({ message : "The email provided must be a string"})
    email : string

    @IsNotEmpty({ message : "password is required"})
    @IsString({ message : "Password must be a string"})
    @Length(8, 20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
        {
            message : 'Password must contain uppercase, lowercase, number, and special character'
        }

    )
    password : string


    // isVerified: Boolean

} 