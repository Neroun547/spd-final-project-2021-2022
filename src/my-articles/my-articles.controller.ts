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
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { UploadArticleDto } from "./dto/upload-article.dto";
import { UploadArticleWithHtmlDto } from "./dto/upload-article-with-html.dto";
import { MyArticlesService } from "./service/my-articles.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class MyArticlesController {
    constructor(private readonly myArticlesService: MyArticlesService) {};

    @UseGuards(JwtAuthGuard)
    @Get("upload-new-article")
    uploadArticleForm(@Req() req: Request, @Res() res: Response) {
        res.render("modules/articles/upload-article-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            styles: ["/css/signInForm.css"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post("upload-new-article")
    @UseInterceptors(FileInterceptor("file", {
        fileFilter:(req, file, cb) => {
            if(file.mimetype !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                cb(null, false);
                return;
            }
            if(+file.size > 100000000){
                cb(null, false);
            } else {
                cb(null, true);
            }
        },
        storage: diskStorage({
            destination: "./views/articles",
            filename: (req, file, cb) => {
                const name = Date.now();
                return cb(null, `${name+Math.floor(Math.random() * 1000) + "." + file.originalname}`);
            }
        })
    }))
    async uploadNewArticle(@Req() req: Request, @Body() body: UploadArticleDto, @Res() res: Response) {
        await this.myArticlesService.convertDocxToHtmlAndDeleteDocx({ 
            filename: req.file.filename,
            theme: body.theme,
            title: body.title,
            publicateUser: req.user["_id"]
        });
        
        res.redirect(`/user/articles/${req.user["username"]}`);
    }

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
    async writeArticleWithHtml(@Req() req: Request, @Body() article: UploadArticleWithHtmlDto, @Res() res: Response) {
        await this.myArticlesService.writeArticleWithHtml(article, req.user["_id"]);

        res.send({ message: `/user/articles/${req.user["username"]}` });
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
    async changeParamsArticle(@Body() newParams: UploadArticleDto, @Param("idArticle") idArticle: string, @Req() req: Request) {
        await this.myArticlesService.changeParamsArticle(newParams, req.user["_id"], idArticle);

        return { message: "Params changed success" };
    }
}
