import { IsString, Length } from "class-validator";
import { MyArticlesDto } from "./myArticles.dto";

export class UploadArticleWithHtmlDto extends MyArticlesDto {
    @IsString()
    @Length(10, 1500)
    content: string;
}
