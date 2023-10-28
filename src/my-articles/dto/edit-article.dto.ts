import {IsString, Length} from "class-validator";

export class EditArticleDto {
    @IsString()
    @Length(1)
    content: string;
}
