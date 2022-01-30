import { IsNotEmpty, IsString, Length } from "class-validator";

export class NewUsernameDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 20, { message: "Username must be between 3 and 20 characters" })
    username: string;
}
