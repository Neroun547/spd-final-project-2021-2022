import { IsString, Length } from "class-validator";

class NewPasswordDto {
    @IsString()
    @Length(6, 28, { message: "Password must be between 6 and 28 characters" })
    password: string;
}