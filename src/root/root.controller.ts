import {Controller, ForbiddenException, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import { RootService } from './root.service';
import {JwtService} from "@nestjs/jwt";
import { secretJwt } from "config.json";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class RootController {
  constructor(
      private service: RootService,
      private jwtService: JwtService
  ) {}

  @Get()
  async infoPage(@Req() req:Request, @Res() res:Response) {

    if(!req.cookies["token"]) {
      res.render("info", {
        auth: false,
        scripts: ["/js/modules/search-user/search-user-form.js"]
      });

      return;
    }
    let userFromToken;

    try {
      userFromToken = await this.jwtService.verify(req.cookies["token"], {secret: secretJwt});
    } catch {
      res.render("info", {
        auth: false,
        scripts: ["/js/modules/search-user/search-user-form.js"]
      });

      return;
    }
    res.render("info", {
      username: userFromToken["username"],
      auth: true,
      idAvatar: userFromToken["idAvatar"],
      scripts: ["/js/modules/search-user/search-user-form.js"]
    });
  }

  @Get("exit")
  async exitAccount(@Req() req:Request, @Res() res:Response) {
    res.cookie("token", "");
    res.redirect("/auth");
  }

  @Post("search-user")
  async searchUser(@Req() req:Request) {
    const data = await this.service.searchUser(req.body.username, 5, 0);

    return {...data};
  }

  @Post("load-more-users")
  async loadMoreUsers(@Req() req: Request) {
    const data = await this.service.searchUser(req.body.username, 5, req.body.skip);

    return {...data};
  }

  @UseGuards(JwtAuthGuard)
  @Get("check-token-interval")
  checkTokenInterval() {
    return;
  }
}
