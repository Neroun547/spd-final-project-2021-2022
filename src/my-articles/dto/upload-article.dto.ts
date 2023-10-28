import { IsString, Length } from "class-validator";

export class UploadArticleDto {
    @IsString()
    @Length(1, 255)
    theme: string;

    @IsString()
    @Length(1, 255)
    title: string

    @IsString()
    @Length(1)
    content: string;
}
