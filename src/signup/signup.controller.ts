import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { SignUpService } from "./service/signup.service";
import { UserDto } from "./dto/user.dto";

@Controller()
export class SignUpController {
    constructor(private readonly service:SignUpService){}
    @Get()
    signUpPage(@Res() res:Response){
        res.render("signup", {
            style: "/css/signInForm.css",
            script: "/js/signup.js"
        });
    }

    @Post()
    async signUp(@Body() body: UserDto, @Res() res:Response){
        await this.service.signUp(body, res);
    }

    @Get("/confirm-account/:token")
    async confirmAccount(@Req() req:Request, @Res() res:Response) {
        const token = req.params["token"];
        await this.service.confirmAccount(token);
        res.redirect("/signin");
    }
}
