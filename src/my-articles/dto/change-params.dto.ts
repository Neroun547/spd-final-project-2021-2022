import {IsString, Length} from "class-validator";

export class ChangeParamsDto {
    @IsString()
    @Length(1, 255)
    theme: string;

    @IsString()
    @Length(1, 255)
    title: string
}
