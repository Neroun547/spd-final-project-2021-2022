import { IsString, IsNotEmpty } from "class-validator"; 

export class NewEmailDto {

    @IsString()
    @IsNotEmpty()
    email: string;
}
