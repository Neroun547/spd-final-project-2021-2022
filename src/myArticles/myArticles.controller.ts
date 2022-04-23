import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseInterceptors } from "@nestjs/common"; 
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { MyArticlesDto } from "./dto/myArticles.dto";
import { MyArticlesService } from "./service/myArticles.service"; 

@Controller()
export class MyArticlesController {
    constructor(private readonly myArticlesService: MyArticlesService) {};

    @Get("upload-new-article")
    uploadArticleForm(@Req() req: Request, @Res() res: Response) {
        res.render("upload-article-form", {
            username: req["user"].username,
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }

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
            publicateUser: req["user"]._id
        });
        
        res.redirect(`/user/articles/${req["user"].username}`);
    }
    @Delete(":idArticle") 
    async deleteArticle(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        await this.myArticlesService.deleteArticle(idArticle, req["user"]._id);

        res.sendStatus(200);
    }
};
