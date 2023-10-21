import {Controller, ForbiddenException, Get, Param, ParseIntPipe, Query, Req, Res} from "@nestjs/common";
import {UserPhotoService} from "./service/user-photo.service";
import {Request, Response} from "express";
import {CommonService} from "../../../common/service/common.service";
import {UserServiceDb} from "../../../db/user/user.service";
import {FriendsService} from "../../friends/service/friends.service";

@Controller()
export class UserPhotoController {

    constructor(
        private userPhotoService: UserPhotoService,
        private commonService: CommonService,
        private usersServiceDb: UserServiceDb,
        private friendsService: FriendsService
    ) {};

    @Get(":username")
    async userPage(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {
        const authUser = await this.commonService.getAuthUserFromRequest(req);

        if(!authUser) {
            const idAvatar = (await this.usersServiceDb.findUserByUsername(username)).idAvatar;
            const countPhoto = await this.userPhotoService.getCountPhotoByUsername(username);
            const photo = await this.userPhotoService.getPhotoByUsername(username, 0, 4);

            res.render("modules/photo/user-photo", {
                auth: false,
                avatarAnotherUser: idAvatar,
                photo: photo,
                activeUser: req.params["username"],
                loadMore: countPhoto > 4,
                scripts: ["/js/modules/another-user/another-user-photo/another-user-photo.js"],
                styles: ["/css/user/another-user.css"]
            });

            return;
        } else if(authUser && authUser["username"] === username) {
            const countPhoto = await this.userPhotoService.getCountPhotoById(authUser["_id"]);
            const photo = await this.userPhotoService.getPhotoIdByIdUser(authUser["_id"], 0, 4);

            res.render("modules/photo/my-photo", {
                username: authUser["username"],
                idAvatar: authUser["idAvatar"],
                auth: true,
                photo: photo,
                activeUser: req.params["username"],
                loadMore: countPhoto > 4,
                scripts: ["/js/modules/my-account/my-photo/my-photo.js"],
                styles: ["/css/user/another-user.css"]
            });
        } else {
            const idAvatar = (await this.usersServiceDb.findUserByUsername(username)).idAvatar;
            const countPhoto = await this.userPhotoService.getCountPhotoByUsername(username);
            const photo = await this.userPhotoService.getPhotoByUsername(username, 0, 4);
            const alreadyFriend = await this.friendsService.alreadyFriend(username, authUser["_id"]);

            res.render("modules/photo/user-photo", {
                username: authUser["username"],
                idAvatar: authUser["idAvatar"],
                auth: true,
                avatarAnotherUser: idAvatar,
                photo: photo,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                activeUser: req.params["username"],
                loadMore: countPhoto > 4,
                scripts: ["/js/modules/another-user/another-user-photo/another-user-photo.js"],
                styles: ["/css/user/another-user.css"]
            });
        }
    }

    @Get("load-more-photo/:skip")
    async loadMorePhotoId(
        @Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
        @Query("user") username: string
    ) {
        if(username) {
            return await this.userPhotoService.getPhotoByUsername(username, skip, 4);
        }
        const authUser = await this.commonService.getAuthUserFromRequest(req);

        if(authUser) {
            return await this.userPhotoService.getPhotoIdByIdUser(authUser["_id"], skip, 4);
        }
        throw new ForbiddenException();
    }

    @Get("item/:id")
    getPhoto(@Req() req: Request, @Res() res: Response){
        this.userPhotoService.getPhoto(req.params["id"], res);
    }
}
