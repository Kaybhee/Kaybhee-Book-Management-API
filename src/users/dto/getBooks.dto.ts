import { IsNotEmpty, IsString } from "class-validator";

export class GetBooksDto {
    @IsString()
    @IsNotEmpty({ message: "This field cannot be empty"})
    ISBN : string
}