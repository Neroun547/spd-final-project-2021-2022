import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  async infoPage(@Req() req:Request, @Res() res:Response) {
    if(req["user"]) {
      res.render("info", {
        auth:true, 
        idAvatar:req["user"].idAvatar,
        script: "/js/modules/search-user/search-user-form.js"
      });

      return;
    } 

    res.render("info", {
      auth: false,
      script: "/js/modules/search-user/search-user-form.js"
    });

  }

  @Get("/exit")
  async exitAccount(@Req() req:Request, @Res() res:Response) {
    res.cookie("token", "");
    res.redirect("/signin");
  }

  @Post("search-user")
  async searchUser(@Req() req:Request, @Res() res:Response) {
    const data = await this.service.searchUser(req.body.username, 5, 0);
    res.send({...data});
  }

  @Post("load-more-users")
  async loadMoreUsers(@Req() req: Request, @Res() res: Response) {
    const data = await this.service.searchUser(req.body.username, 5, req.body.skip);
    res.send({...data});
  }

  @Get("check-token-interval")
  checkTokenInterval(@Req() req: Request, @Res() res: Response) {
    res.sendStatus(200);
  }
}
