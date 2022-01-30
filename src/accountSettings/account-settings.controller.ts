import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { AccountService } from "./service/account.service";
import { diskStorage } from "multer";
import { NewNameDto } from "./dto/new-name.dto";
import { NewUsernameDto } from "./dto/new-username.dto";
import { NewPasswordDto } from "./dto/new-password.dto";
import { NewEmailDto } from "./dto/new-email.dto";

@Controller()
export class AccountSettingsController {
    constructor(private readonly service:AccountService){}

    @Get()
    settingsPage(@Req() req:Request, @Res() res:Response){
        res.render("account-settings", {
            auth: true,
            name: req["user"].name,
            username: req["user"].username,
            email: req["user"].email,
            idAvatar: req["user"].idAvatar,
            style: "/css/account-settings.css"
        });
    };
    
    @Post("upload-avatar")
    @UseInterceptors(FileInterceptor('file', {
        fileFilter:(req, file, cb) => {
            if(+file.size > 1000000){
                cb(null, false);
            } else {
                cb(null, true);
            }
        },
        storage:diskStorage({
            destination: './avatars',
            filename:(req, file, cb) => {
                const name = Date.now();
                return cb(null, `${name+Math.floor(Math.random() * 1000) + "." + file.mimetype.replace("image/", "")}`);
            }
        })
    }))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req:Request, @Res() res:Response) {
        const newToken = await this.service.uploadAvatar(file, req["user"], req.file.filename);
        
        res.cookie("token", newToken);
        res.send("Avatar uploaded success");
    };

    @Get("avatar/:id")
    async getAvatar(@Req() req:Request, @Res() res:Response) {
        await this.service.getAvatar(req.params.id, req, res);
    }

    /*----*/
    
    @Get("change-name")
    changeNameForm(@Req() req:Request, @Res() res:Response) {
        res.render("change-name-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }

    @Post("new-name")
    async newName(@Body() body: NewNameDto, @Req() req:Request, @Res() res:Response) {
        const newToken = await this.service.newName(req["user"], body.name);
        
        res.cookie("token", newToken);
        res.redirect("/");
    }

    /*----*/

    @Get("change-username")
    changeUserNameForm(@Req() req:Request, @Res() res:Response) {
        res.render("change-username-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }
    
    @Post("new-username")
    async newUserName(@Body() body: NewUsernameDto, @Req() req:Request, @Res() res:Response) {
        const newToken = await this.service.newUserName(req["user"], body.username);

        res.cookie("token", newToken);
        res.redirect("/");
    }

    /*----*/

    @Get("change-password")
    changePassword(@Req() req:Request, @Res() res:Response) {
        res.render("change-password-check-old-pass", {
            auth:true,
            idAvatar:req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }

    @Post("check-old-password")
    async checkOldPassword(@Req() req: Request, @Res() res: Response) {
        const newToken = await this.service.checkOldPassword(req["user"], req.body.password);

        res.cookie("token", newToken);
        res.redirect("/account-settings/new-password");
    } 

    @Get("new-password")
    async newPassword(@Req() req: Request, @Res() res: Response) {
        if(req["user"].changePassword){
            res.render("change-password-form", {
                auth: true,
                idAvatar: req["user"].idAvatar,
                style: "/css/signInForm.css"
            });
        } else {
            res.redirect("/account-settings/change-password");
        }
    }

    @Post("new-password")
    async setNewPassword(@Body() body: NewPasswordDto, @Req() req:Request, @Res() res:Response) {
        const newToken = await this.service.newPassword(req["user"], body.password);

        res.cookie("token", newToken);
        res.redirect("/");
    }

    /*----*/

    @Get("change-email")
    async changeEmail(@Req() req:Request, @Res() res:Response) {
        res.render("change-email-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }
    
    @Post("new-email")
    async newEmail(@Body() body: NewEmailDto,  @Req() req:Request, @Res() res:Response) {
        await this.service.newEmail(req["user"], body.email);

        res.send("Message send in your email");
    }

    @Get("confirm-new-email/:token")
    async confirmNewEmail(@Req() req: Request, @Res() res: Response) {
        const newToken = await this.service.confirmNewEmail(req.params["token"]);

        res.cookie("token", newToken);
        res.redirect("/");
    }
}
