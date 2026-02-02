import { IsString, IsNotEmpty } from "class-validator";

export class updateBookContentDto {
    @IsString()
    @IsNotEmpty()
    Edition ?: string

    @IsString()
    @IsNotEmpty()
    Genre ?: string

    @IsString()
    @IsNotEmpty()
    Publisher ?: string

}