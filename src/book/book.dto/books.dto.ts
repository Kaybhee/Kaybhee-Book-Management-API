import { IsString, IsNotEmpty, Length, Matches, Max, Min, min, Equals, MaxLength, MinLength,  } from "class-validator";
export class BookCreationDto {
    @IsString({ message: "The title of this book must be a string"})
    @IsNotEmpty({ message: "This field must not be empty" })
    bookName: string

    @IsString({ message: "The title of this book must be a string"})
    @IsNotEmpty({ message: "This field must not be empty" })
    Author: string

    @IsString({ message: "This must be a string"})
    @MinLength(13, { message : "The Book No must not be less than 13 characters"})
    @MaxLength(13, { message : "The Book No must not be more than 13 characters"})
    @IsNotEmpty({message: "This field must not be empty"})
    ISBN: string

    @IsString({message: "This serial no must be a string"})
    @MinLength(10, { message : "The Serial No must not be less than 10 characters"})
    @MaxLength(10, { message : "The Serial No must not be more than 10 characters"})
    @IsNotEmpty({ message: "This cannot be empty"})
    ISSN: string





    
}