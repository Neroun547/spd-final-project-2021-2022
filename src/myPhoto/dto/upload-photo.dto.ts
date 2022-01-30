import { IsNotEmpty, IsString, Length } from "class-validator";

export class UploadPhotoDto {
    @IsString()
    @Length(0, 900, { message: "Description photo may have 1 to 900 symbols" })
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50, { message: "Theme photo may have 1 to 900 symbols" })
    readonly theme: string;
}
