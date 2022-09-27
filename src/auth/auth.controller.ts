import { Controller, Req, Res, Get, Post, Body } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./service/auth.service";
import { UserDto } from "./dto/user.dto";

@Controller()
export class AuthController {
    constructor(private readonly service:AuthService){}
    @Get()
    signInPage(@Req() req: Request, @Res() res: Response) {
        res.render("auth", {
            style: "/css/signInForm.css",
            script: "/js/modules/auth/auth.js"
        });
    }
    
    @Post()
    async auth(@Body() body: UserDto, @Res() res: Response) {
        const newToken = await this.service.auth(body);

        res.cookie("token", newToken, { sameSite: true });
        res.send({ message: "Auth success" });
    }
}
