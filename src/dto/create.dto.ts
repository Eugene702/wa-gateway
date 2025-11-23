import { IsString } from "class-validator";

export class CreateDto{
    @IsString()
    to: string

    @IsString()
    message: string
}