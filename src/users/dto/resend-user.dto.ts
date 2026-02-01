import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";


@Injectable()
export class ResendUserOtpDto {
    @IsString({ message: "This must be a string"})
    @IsNotEmpty({ message: "This field must not be empty"})
    email: string
}
