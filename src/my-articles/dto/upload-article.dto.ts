import { IsNotEmpty, Length } from "class-validator";

export class UploadArticleDto {
    @IsNotEmpty()
    @Length(1, 50, { message: "Theme article may have 1 to 30 symbols" })
    theme: string;

    @IsNotEmpty()
    @Length(1, 60, { message: "Title article may have 1 to 60 symbols" })
    title: string;
}