import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseInterceptors } from "@nestjs/common"; 
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { MyArticlesDto } from "./dto/myArticles.dto";
import { MyArticlesService } from "./service/myArticles.service"; 

@Controller()
export class MyArticlesController {
    constructor(private readonly myArticlesService: MyArticlesService) {};

    @Get()
    async myArticlesPage(@Req() req: Request, @Res() res: Response) {
        const articles = await this.myArticlesService.getArticles(req["user"]._id, 0, 5);
        const count = await this.myArticlesService.getCountArticles(req["user"]._id);

        res.render("my-articles", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/my-articles.css",
            articles,
            loadMore: count > 5 ? true : false,
            script: "/js/my-articles.js"
        });
    }

    @Get("upload-new-article")
    uploadArticleForm(@Req() req: Request, @Res() res: Response) {
        res.render("upload-article-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css",
            script: "/js/upload-article.js"
        });
    }

    @Post("upload-new-article")
    @UseInterceptors(FileInterceptor("file", {
        fileFilter:(req, file, cb) => {
            if(file.mimetype !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                cb(null, false);
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
            publicateUser: req["user"]._id
        });
        
        res.redirect("/my-articles");
    }

    @Get("load-more-articles/:skip")
    async loadMoreArticles(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number, @Res() res: Response) {
        const articles = await this.myArticlesService.getArticles(req["user"]._id, skip, 5);
        
        res.send(articles);
    }

    @Get(":idArticle")
    async loadArticle(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        const article = await this.myArticlesService.getArticle(idArticle);
        
        if(req["user"]) {
            res.render(`articles/${article.article}`, {
                auth: true,
                idAvatar: req["user"].idAvatar,
                style: "/css/article.css"
            });

            return;
        }

        res.render(`articles/${article.article}`, {
            auth: false,
            style: "/css/article.css"
        });
    }

    @Delete(":idArticle") 
    async deleteArticle(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        await this.myArticlesService.deleteArticle(idArticle, req["user"]._id);

        res.sendStatus(200);
    }
};
