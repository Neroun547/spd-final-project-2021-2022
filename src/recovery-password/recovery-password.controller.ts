import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
    Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { RecoveryPasswordService } from "./service/recovery-password.service";
import { CheckEmailDto } from "./dto/check-email.dto";
import { email, protocol, host, appPort, secretJwt } from "config.json";
import * as jwt from "jsonwebtoken";
import { NewPasswordDto } from "src/account-settings/dto/new-password.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Controller()
export class RecoveryPasswordController {
    constructor(
        private service: RecoveryPasswordService,
        private mailerService: MailerService
        ) {}

    @Get("check-email-form")
    checkEmailForm(@Req() req: Request, @Res() res: Response) {
        res.render("modules/account-settings/check-email-form", {
            styles: ["/css/signInForm.css"],
            scripts: ["/js/modules/recovery-password/recovery-password.js"]
        });
    }

    @Post("check-email")
    async checkEmail(@Body() body: CheckEmailDto, @Res() res: Response) {
        const checkEmail = await this.service.checkEmail(body.email);

        if(!checkEmail) {
            throw new NotFoundException(["User with this email not found"]);
        }
        const token = await jwt.sign({ email: checkEmail.email }, secretJwt, { expiresIn: 60*5  });

        await this.mailerService.sendMail({
            from: email,
            to: body.email,
            subject: "New password",
            html: `
            <h2>Hello ${checkEmail.name} ! Create new password</h2>
            <a href="${protocol}://${host}:${appPort}/recovery-password/new-password/${token}">Click for create new password</a>`
        });

        res.send({ message: "Message send on email (Maybe in spam)" });
    }

    @Get("new-password/:token")
    async newPasswordForm(@Req() req: Request, @Param("token") token: string, @Res() res: Response) {
        try {
            const user = await jwt.verify(token, secretJwt);

            res.render("modules/account-settings/recovery-password-form.hbs", {
                email: user["email"],
                styles: ["/css/signInForm.css"]
            });
        } catch {
            throw new BadRequestException([ "Bad Request" ]);
        }
    }

    @Post("new-password/:email")
    async newPassword(@Req() req: Request, @Param("email") email: string, @Body() body: NewPasswordDto, @Res() res: Response) {
        await this.service.newPassword(email, body.password);

        res.redirect("/auth");
    }
}
