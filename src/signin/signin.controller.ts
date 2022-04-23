import { Controller, Req, Res, Get, Post, Body } from "@nestjs/common";
import { Request, Response } from "express";
import { SignInService } from "./service/signin.service";
import { UserDto } from "./dto/user.dto";

@Controller()
export class SignInController {
    constructor(private readonly service:SignInService){}
    @Get()
    signInPage(@Req() req: Request, @Res() res: Response) {
        res.render("signin", {
            style: "/css/signInForm.css",
            script: "/js/modules/signin/signin.js"
        });
    }

    @Post()
    async signIn(@Body() body: UserDto, @Res() res: Response) {
        const newToken = await this.service.signIn(body);

        res.cookie("token", newToken);
        res.send({ message: "Auth success" });
    }
}
