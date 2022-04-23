import { Controller, Param, Req, Res, Get, ParseIntPipe, Query } from "@nestjs/common";
import { UserPhotoService } from "./service/user-photo.service";
import { Request, Response } from "express";  

@Controller()
export class UserPhotoController {

    constructor(private service: UserPhotoService) {};

    @Get(":username")
    async userPage(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {

        if(req["user"] && req["user"].username === req.params["username"]) {
            const idAvatar = await this.service.getIdAvatar(username);
            const countPhoto = await this.service.getCountPhotoById(req["user"]._id);
            const photo = await this.service.getPhotoIdByIdUser(req["user"]._id, 0, 4);

            res.render("my-photo", {
                username: req["user"].username,
                idAvatar: req["user"].idAvatar,
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


        if(req["user"] && req["user"].username !== req.params["username"]) {
            const idAvatar = await this.service.getIdAvatar(username);
            const countPhoto = await this.service.getCountPhotoByUsername(username);
            const photo = await this.service.getPhotoByUsername(username, 0, 4);
            const alreadyFriend = await this.service.alreadyFriend(username, req["user"]._id);

            res.render("user", {
                username: req["user"].username,
                idAvatar: req["user"].idAvatar,
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
    }

    @Get("load-more-photo/:skip")
    async loadMorePhotoId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string, @Res() res: Response) {

        if(!username) {
            const photo = await this.service.getPhotoIdByIdUser(req["user"]._id, skip, 4);

            res.send(photo);
            
            return;
        }
        const photo = await this.service.getPhotoByUsername(username, skip, 4);

        res.send(photo);
    }

    @Get("item/:id")
    getPhoto(@Req() req:Request, @Res() res:Response){
        this.service.getPhoto(req.params["id"], res);
    }   
}
