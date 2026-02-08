import { IsNotEmpty, IsInt } from "class-validator"

export class ReturnBookDto {
    @IsInt({ message: "borrowId must be an integer" })
    @IsNotEmpty({ message: "borrowId cannot be empty" })
    borrowId: number
}
