import { IsString, IsNotEmpty, Length } from "class-validator";

export class UploadVideoDto {
    
    @IsString()
    @IsNotEmpty()
    @Length(3, 50, { message:"Name video may have 3 to 50 symbols" })
    readonly name: string;

    @IsString()
    @Length(0, 900, { message: "Description video may have 1 to 900 symbols" })
    readonly description: string;
}
