import {Controller, Get, Post, Req, Res, UseGuards} from "@nestjs/common";
import { Response, Request } from "express";
import { ChatService } from "./service/chat.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class ChatController {

    constructor(private readonly service: ChatService) {};

    @UseGuards(JwtAuthGuard)
    @Get()
    async chatsPage(@Req() req: Request, @Res() res: Response) {
        const chats = await this.service.getAllChats(req.user["_id"]);
    
        res.render("chat", {
            username: req.user["username"],
            idAvatar: req.user["idAvatar"],
            auth: true,
            headScript: "/js/modules/chat/socketConnect.js",
            style: "/css/chat.css",
            chats: chats,
            socketScript: "https://cdn.socket.io/4.3.2/socket.io.min.js"
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get(":username")
    async chatPage(@Req() req: Request, @Res() res: Response) {
        const messages = await this.service.createChatOrGetData(req.user["_id"], req.params["username"]);
        const countMessages = await this.service.countMessage(req.user["_id"], req.params["username"]);
    
        res.render("single-messages", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            headScript: "/js/modules/chat/socketConnect.js",
            script: "/js/modules/chat/chat.js",
            style: "/css/chat.css",
            activeUser: req.params["username"],
            messages: messages ? messages.reverse() : false,
            loadMoreMessages: countMessages > 10 ? true : false,
            socketScript: "https://cdn.socket.io/4.3.2/socket.io.min.js"
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get("messages-user/:username")
    async chatMessagesUser(@Req() req: Request, @Res() res: Response) {
        const messages = await this.service.chatMessagesUser(req.user["_id"], req.params["username"], 10, 0);
        const countMessages = await this.service.countMessage(req.user["_id"], req.params["username"]);
        const chats = await this.service.getAllChats(req.user["_id"]);
 
        res.render("chat", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            headScript: "/js/modules/chat/socketConnect.js",
            script: "/js/modules/chat/chat.js",
            style: "/css/chat.css",
            activeUser: req.params["username"],
            messages:  messages ? messages.reverse() : false,
            selectChat: req.params["username"],
            chats: chats,
            loadMoreMessages: countMessages > 10 ? true : false,
            socketScript: "https://cdn.socket.io/4.3.2/socket.io.min.js"
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post("load-more-messages")
    async loadMoreMessages(@Req() req: Request, @Res() res: Response) {
        const messages = await this.service.chatMessagesUser(req.user["_id"], req.body.getter, 10, req.body.skip);
        res.send(messages);
    }
}
