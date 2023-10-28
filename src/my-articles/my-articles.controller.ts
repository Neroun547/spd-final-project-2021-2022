import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseGuards
} from "@nestjs/common";
import { Request, Response } from "express";
import { UploadArticleDto } from "./dto/upload-article.dto";
import { MyArticlesService } from "./service/my-articles.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {ChangeParamsDto} from "./dto/change-params.dto";
import {EditArticleDto} from "./dto/edit-article.dto";

@Controller()
export class MyArticlesController {
    constructor(private readonly myArticlesService: MyArticlesService) {};

    @UseGuards(JwtAuthGuard)
    @Get("write-article-with-redactor")
    writeArticleWithHtmlPage(@Req() req: Request, @Res() res: Response) {
        res.render("modules/articles/write-article-with-redactor", {
            auth: true,
            username: req.user["username"],
            idAvatar: req.user["idAvatar"],
            styles: ["/css/articles/write-article-with-redactor.css"],
            headScripts: ["/js/modules/my-account/my-articles/article-editor.js"],
            scripts: ["/js/modules/my-account/my-articles/upload-article-with-redactor.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post("write-article-with-redactor")
    async uploadArticle(@Req() req: Request, @Body() article: UploadArticleDto, @Res() res: Response) {
        await this.myArticlesService.writeArticleWithHtml(article, req.user["_id"]);

        res.send({ message: `/user/articles/${req.user["username"]}` });
    }

    @UseGuards(JwtAuthGuard)
    @Get("edit-article/:idArticle")
    async editArticlePage(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        const content = await this.myArticlesService.getArticleContentByArticleId(idArticle);

        res.render("modules/articles/edit-article", {
            auth: true,
            username: req.user["username"],
            idAvatar: req.user["idAvatar"],
            idArticle: idArticle,
            content: content,
            styles: ["/css/articles/write-article-with-redactor.css"],
            headScripts: ["/js/modules/my-account/my-articles/article-editor-for-edit.js"],
            scripts: ["/js/modules/my-account/my-articles/upload-article-with-redactor.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Patch("edit-article/:idArticle")
    async editArticle(@Body() body: EditArticleDto, @Req() req: Request, @Param("idArticle") idArticle: string) {
        await this.myArticlesService.editArticleByArticleId(body.content, idArticle, req.user["_id"]);

        return { message: "/user/articles/" + req.user["username"] };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":idArticle")
    async deleteArticle(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        await this.myArticlesService.deleteArticle(idArticle, req.user["_id"]);

        res.sendStatus(200);
    }

    @UseGuards(JwtAuthGuard)
    @Get("change-params-form/:idArticle")
    changeParamsArticleForm(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        res.render("modules/articles/change-article-param-form", {
            idArticle: idArticle,
            auth: true,
            idAvatar: req.user["idAvatar"],
            username: req.user["username"],
            scripts: ["/js/modules/my-account/my-articles/change-params-article.js"],
            styles: ["/css/signInForm.css"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":idArticle")
    async changeParamsArticle(@Body() newParams: ChangeParamsDto, @Param("idArticle") idArticle: string, @Req() req: Request) {
        await this.myArticlesService.changeParamsArticle(newParams, req.user["_id"], idArticle);

        return { message: "Params changed success" };
    }
}
