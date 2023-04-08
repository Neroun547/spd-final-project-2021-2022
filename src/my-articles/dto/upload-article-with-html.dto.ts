import { IsString, Length } from "class-validator";
import { UploadArticleDto } from "./upload-article.dto";

export class UploadArticleWithHtmlDto extends UploadArticleDto {
    @IsString()
    @Length(10, 150000)
    content: string;
}
