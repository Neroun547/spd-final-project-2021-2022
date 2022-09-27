import { Controller, Param, Req, Res, Get, ParseIntPipe, Query } from "@nestjs/common";
import { UserPhotoService } from "./service/user-photo.service";
import { Request, Response } from "express";
import {JwtService} from "@nestjs/jwt";
import { secretJwt } from "config.json";

@Controller()
export class UserPhotoController {

    constructor(
        private service: UserPhotoService,
        private jwtService: JwtService
    ) {};

    @Get(":username")
    async userPage(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {

        if(!req.cookies["token"]) {
            const idAvatar = await this.service.getIdAvatar(username);
            const countPhoto = await this.service.getCountPhotoByUsername(username);
            const photo = await this.service.getPhotoByUsername(username, 0, 4);

            res.render("user", {
                auth: false,
                avatarAnotherUser: idAvatar,
                photo: photo,
                activeUser: req.params["username"],
                loadMore: countPhoto > 4 ? true : false,
                script: "/js/modules/another-user/another-user-photo/another-user-photo.js",
                style: "/css/another-user.css"
            });

            return;
        }
        const user = this.jwtService.verify(req.cookies["token"], { secret: secretJwt });
        if(user && user["username"] === username) {
            const idAvatar = await this.service.getIdAvatar(username);
            const countPhoto = await this.service.getCountPhotoById(user["_id"]);
            const photo = await this.service.getPhotoIdByIdUser(user["_id"], 0, 4);

            res.render("my-photo", {
                username: user["username"],
                idAvatar: user["idAvatar"],
                auth: true,
                avatarAnotherUser: idAvatar,
                photo: photo,
                activeUser: req.params["username"],
                loadMore: countPhoto > 4 ? true : false,
                script: "/js/modules/my-account/my-photo/my-photo.js",
                style: "/css/another-user.css"
            });
            return;
        }


        if(user && user["username"] !== username) {
            const idAvatar = await this.service.getIdAvatar(username);
            const countPhoto = await this.service.getCountPhotoByUsername(username);
            const photo = await this.service.getPhotoByUsername(username, 0, 4);
            const alreadyFriend = await this.service.alreadyFriend(username, user._id);

            res.render("user", {
                username: user["username"],
                idAvatar: user["idAvatar"],
                auth: true,
                avatarAnotherUser: idAvatar,
                photo: photo,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                activeUser: req.params["username"],
                loadMore: countPhoto > 4 ? true : false,
                script: "/js/modules/another-user/another-user-photo/another-user-photo.js",
                style: "/css/another-user.css"
            });

            return;
        }
    }

    @Get("load-more-photo/:skip")
    async loadMorePhotoId(
        @Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
        @Query("user") username: string
    ) {
        if(!req.cookies["token"] || username) {
            const photo = await this.service.getPhotoByUsername(username, skip, 4);

            return photo;
        }
        const user = this.jwtService.verify(req.cookies["token"], { secret: secretJwt });

        return await this.service.getPhotoIdByIdUser(user._id, skip, 4);
    }

    @Get("item/:id")
    getPhoto(@Req() req:Request, @Res() res:Response){
        this.service.getPhoto(req.params["id"], res);
    }   
}
