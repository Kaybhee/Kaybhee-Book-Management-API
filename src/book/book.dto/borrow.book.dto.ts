import { Type } from "class-transformer"
import { IsNotEmpty, IsInt, IsDate, IsNumber } from "class-validator"


export class BorrowBooksDto {
    @IsInt()
    @IsNotEmpty()
    bookId: number

    @Type(() => Date)
    @IsDate({ message: "It must be a date"})
    @IsNotEmpty({ message: "This field cannot be empty"})
    returnDate: Date

}