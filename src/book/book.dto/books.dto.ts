import { IsString, IsNotEmpty, Length, Matches, Max, Min, min, Equals, MaxLength, MinLength, IsOptional,  } from "class-validator";
export class BookCreationDto {
    // @IsString({ message: "The title of this book must be a string"})
    // @IsNotEmpty({ message: "This field must not be empty" })
    // bookName: string

    @IsString({ message: "The title of this book must be a string"})
    @IsNotEmpty({ message: "This field must not be empty" })
    Author: string

    @IsString({ message: "This must be a string"})
    @MinLength(13, { message : "The Book No must not be less than 13 characters"})
    @MaxLength(13, { message : "The Book No must not be more than 13 characters"})
    @IsNotEmpty({message: "This field must not be empty"})
    ISBN: string

    @IsString({message: "This title must be a string"})
    @IsNotEmpty({ message: "This cannot be empty"})
    Title: string

    @IsString({message: "The edition must be a string"})
    @IsNotEmpty({ message: "This cannot be empty"})
    Edition: string

    @IsOptional()
    @IsString({message: "The Publisher must be a string"})
    @IsNotEmpty({ message: "This cannot be empty"})
    Publisher: string


    @IsOptional()
    @IsString({message: "The Genre must be a string"})
    @IsNotEmpty({ message: "This cannot be empty"})
    Genre: string


    
}