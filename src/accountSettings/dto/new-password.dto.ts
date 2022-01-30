import { IsNotEmpty, IsString, Length } from "class-validator";

export class NewPasswordDto {
    @IsString()
    @IsNotEmpty()
    @Length(6, 28, { message: "Password must be between 6 and 28 characters" })
    password: string;
}
