import {Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards, UseInterceptors} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { MyArticlesDto } from "./dto/myArticles.dto";
import { UploadArticleWithHtmlDto } from "./dto/uploadArticleWithHtml.dto";
import { MyArticlesService } from "./service/myArticles.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class MyArticlesController {
    constructor(private readonly myArticlesService: MyArticlesService) {};

    @UseGuards(JwtAuthGuard)
    @Get("upload-new-article")
    uploadArticleForm(@Req() req: Request, @Res() res: Response) {
        res.render("upload-article-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            style: "/css/signInForm.css"
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
    async uploadNewArticle(@Req() req: Request, @Body() body: MyArticlesDto, @Res() res: Response) {
        await this.myArticlesService.convertDocxToHtmlAndDeleteDocx({ 
            filename: req.file.filename,
            theme: body.theme,
            title: body.title,
            publicateUser: req.user["_id"]
        });
        
        res.redirect(`/user/articles/${req.user["username"]}`);
    }

    @UseGuards(JwtAuthGuard)
    @Get("write-article-with-html")
    writeArticleWithHtmlPage(@Req() req: Request, @Res() res: Response) {
        res.render("write-article-with-html", {
            auth: true,
            username: req.user["username"],
            idAvatar: req.user["idAvatar"],
            style: "/css/write-article-with-html.css",
            headScript: "/js/modules/my-account/my-articles/article-editor.js",
            script: "/js/modules/my-account/my-articles/upload-article-with-html.js"
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post("write-article-with-html")
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
}
