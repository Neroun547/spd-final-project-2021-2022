import { IsNotEmpty, IsString, Length } from "class-validator";

export class UserDto {

    @IsString()
    @IsNotEmpty()
    @Length(1, 50, { message: "Name must be between 1 and 50 characters" })
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 20, { message: "Username must be between 3 and 20 characters" })
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 28, { message: "Password must be between 6 and 28 characters" })
    password: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}
