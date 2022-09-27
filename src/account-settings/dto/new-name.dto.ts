import { IsString, IsNotEmpty, Length } from "class-validator";  

export class NewNameDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 50, { message: "Name must be between 1 and 50 characters" })
    name: string;
}
