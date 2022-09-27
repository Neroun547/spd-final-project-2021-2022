import {Controller, ForbiddenException, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import { RootService } from './root.service';
import {JwtService} from "@nestjs/jwt";
import {UserServiceDb} from "../../db/user/user.service";
import { secretJwt } from "config.json";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class RootController {
  constructor(
      private service: RootService,
      private jwtService: JwtService,
      private userServiceDb: UserServiceDb
  ) {}

  @Get()
  async infoPage(@Req() req:Request, @Res() res:Response) {

    if(!req.cookies["token"]) {
      res.render("info", {
        auth: false,
        script: "/js/modules/search-user/search-user-form.js"
      });

      return;
    }
    const userFromToken = await this.jwtService.verify(req.cookies["token"], { secret: secretJwt });
    const user = await this.userServiceDb.findUserById(userFromToken._id);

    if (user) {
      res.render("info", {
        username: user["username"],
        auth: true,
        idAvatar: user["idAvatar"],
        script: "/js/modules/search-user/search-user-form.js"
      });

      return;
    }
    res.render("info", {
      auth: false,
      script: "/js/modules/search-user/search-user-form.js"
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
