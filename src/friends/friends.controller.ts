import { Controller, Delete, Get, Req, Res, Post } from "@nestjs/common";
import { Request, Response } from "express";
import { MyFriendsService } from "./service/friends.service";
 
@Controller()
export class FriendsController {
    constructor(private readonly service: MyFriendsService){}

    @Get()
    async friendsPage(@Req() req: Request, @Res() res: Response){
        const friends = await this.service.getFriends(req["user"]._id, 5, 0);
        const countFriends = await this.service.getCountFriends(req["user"]._id);
    
        res.render("friends", {
            username: req["user"].username,
            auth: true,
            idAvatar: req["user"].idAvatar,
            friends: friends,
            countFriends: countFriends,
            script:"/js/modules/my-account/my-friends/friends.js",
            style: "/css/friends.css",
            loadMoreFriends: countFriends > 4 ? true : false
        });
    }

    @Delete("remove")
    async deleteFriend(@Req() req: Request, @Res() res: Response) {
        await this.service.deleteFriend(req["user"]._id, Number(req.body.idFriend));

        res.sendStatus(200);
    }

    @Post("load-more-friends")
    async loadMoreFriends(@Req() req: Request, @Res() res: Response) {
        const friends = await this.service.getFriends(req["user"]._id, 5, req.body.skip);
        
        res.send(friends);
    }
};
