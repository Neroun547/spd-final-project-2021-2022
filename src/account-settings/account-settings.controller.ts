import {Body, Controller, Get, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import { Request, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { AccountSettingsService } from "./service/account-settings.service";
import { diskStorage } from "multer";
import { NewNameDto } from "./dto/new-name.dto";
import { NewUsernameDto } from "./dto/new-username.dto";
import { NewPasswordDto } from "./dto/new-password.dto";
import { NewEmailDto } from "./dto/new-email.dto";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class AccountSettingsController {
    constructor(private readonly service:AccountSettingsService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    settingsPage(@Req() req: Request, @Res() res: Response){
        res.render("account-settings", {
            auth: true,
            name: req.user["name"],
            username: req.user["username"],
            email: req.user["email"],
            idAvatar: req.user["idAvatar"],
            style: "/css/account-settings.css"
        });
    };

    @UseGuards(JwtAuthGuard)
    @Post("upload-avatar")
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            
            if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg") {
                cb(null, false);
                return;
            }
            if(+file.size > 1000000){
                cb(null, false);
            } else {
                cb(null, true);
            }
        },
        storage: diskStorage({
            destination: './avatars',
            filename:(req, file, cb) => {
                const name = Date.now();
                return cb(null, `${name+Math.floor(Math.random() * 1000) + "." + file.mimetype.replace("image/", "")}`);
            }
        })
    }))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response) {
        const newToken = await this.service.uploadAvatar(file, req.user, req.file.filename);
        
        res.cookie("token", newToken);
        res.redirect("/account-settings");
    };

    @Get("avatar/:id")
    async getAvatar(@Req() req:Request, @Res() res:Response) {
        await this.service.getAvatar(req.params.id, req, res);
    }

    /*----*/
    @UseGuards(JwtAuthGuard)
    @Get("change-name")
    changeNameForm(@Req() req:Request, @Res() res:Response) {
        res.render("change-name-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            style: "/css/signInForm.css",
            script: ["/js/modules/my-account/account-settings/new-name/new-name.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Put("new-name")
    async newName(@Body() body: NewNameDto, @Req() req:Request, @Res() res:Response) {
        const newToken = await this.service.newName(req.user, body.name);
        
        res.cookie("token", newToken);
        res.send({ message: "Name change success" });
    }

    /*----*/
    @UseGuards(JwtAuthGuard)
    @Get("change-username")
    changeUserNameForm(@Req() req:Request, @Res() res:Response) {
        res.render("change-username-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            style: "/css/signInForm.css",
            script: ["/js/modules/my-account/account-settings/new-username/new-username.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Put("new-username")
    async newUserName(@Body() body: NewUsernameDto, @Req() req:Request, @Res() res:Response) {
        const newToken = await this.service.newUserName(req.user, body.username);

        res.cookie("token", newToken);
        res.send({ message: "User name change success" });
    }

    /*----*/
    @UseGuards(JwtAuthGuard)
    @Get("change-password")
    changePasswordCheckOldPassword(@Req() req:Request, @Res() res:Response) {
        res.render("change-password-check-old-pass", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            style: "/css/signInForm.css"
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post("check-old-password")
    async checkOldPassword(@Req() req: Request, @Res() res: Response) {
        await this.service.checkOldPassword(req.user, req.body.password);

        res.redirect("/account-settings/new-password");
    }

    @UseGuards(JwtAuthGuard)
    @Get("new-password")
    newPasswordForm(@Req() req: Request, @Res() res: Response) {
        res.render("change-password-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            style: "/css/signInForm.css",
            script: ["/js/modules/my-account/account-settings/new-password/new-password.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Put("new-password")
    async setNewPassword(@Body() body: NewPasswordDto, @Req() req:Request, @Res() res:Response) {
        const newToken = await this.service.newPassword(req.user, body.password);

        res.cookie("token", newToken);
        res.send({ message: "Password change success" });
    }

    /*----*/
    @UseGuards(JwtAuthGuard)
    @Get("change-email")
    async changeEmail(@Req() req:Request, @Res() res:Response) {
        res.render("change-email-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            style: "/css/signInForm.css",
            script: ["/js/modules/my-account/account-settings/new-email/new-email.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Put("new-email")
    async newEmail(@Body() body: NewEmailDto,  @Req() req: Request) {
        await this.service.newEmail(req.user, body.email);

        return { message:  "Message send in your email" };
    }

    @Get("confirm-new-email/:token")
    async confirmNewEmail(@Req() req: Request, @Res() res: Response) {
        const newToken = await this.service.confirmNewEmail(req.params["token"]);

        res.cookie("token", newToken);
        res.redirect("/");
    }
}
