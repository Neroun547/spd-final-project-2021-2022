import { IsString, IsNotEmpty, Length } from "class-validator";

export class UploadMusicDto {
    
    @IsString()
    @IsNotEmpty()
    @Length(3, 50, { message:"Name music may have 3 to 50 symbols" })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 50, { message:"Name author may have 3 to 50 symbols" })
    readonly author: string;
}
