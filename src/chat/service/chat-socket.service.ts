import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { secretJwt } from "config.json";
import * as cookie from "cookie";
import * as jwt from "jsonwebtoken";
import { UserServiceDb } from "db/user/user.service";
import { ChatsServiceDb } from "db/chats/chats.service";
import { MessagesServiceDb } from "db/messages/messages.service";
import { Message } from "../interfaces/message.interface";
import { host, appPort, protocol } from "config.json";

@WebSocketGateway({
    cors: {
      origin: `${protocol}://${host}:${appPort}`,
    },
})
export class ChatSocketService {
    constructor(
      private readonly userService: UserServiceDb,
      private readonly chatsService: ChatsServiceDb,
      private readonly messagesService: MessagesServiceDb
    ) {};

    @WebSocketServer()
    server: Server;

    @SubscribeMessage("joinRoom")
    async joinRoomEvent(@ConnectedSocket() socket: Socket) {
      const getterUsername = socket.request.headers.referer.replace(`${protocol}://${host}:${appPort}/chat/`, "");
      const senderId = (await jwt.verify(cookie.parse(socket.request.headers.cookie).token, secretJwt))["_id"];
      const getterId = await this.userService.getIdUserByUsername(getterUsername.replace("messages-user/", ""));

      const chatId = await this.chatsService.getChatIdBySenderAndGetter(senderId, getterId);
      
      const prevRoom = [...socket.rooms].find(el => el.includes("activeRoom="));
      socket.leave(prevRoom);
      socket.join("activeRoom="+chatId);
    }

    @SubscribeMessage("message")
    async messageEvenet(@ConnectedSocket() socket: Socket, @MessageBody() data: Message) {
      const getterUsername = socket.request.headers.referer.replace(`${protocol}://${host}:${appPort}/chat/`, "");
      const token = await jwt.verify(cookie.parse(socket.request.headers.cookie).token, secretJwt);
     
      const senderId = token["_id"];
      const getterId = await this.userService.getIdUserByUsername(getterUsername.replace("messages-user/", ""));
      
      const activeRoom = [...socket.rooms].find(el => el.includes("activeRoom="));
      // If chat exist in two users - send message else create chat for second user
      const exists = await this.chatsService.existChat(getterId, senderId);

      if(exists) {
        await this.messagesService.saveMessage(senderId, getterId, data.message, activeRoom.replace("activeRoom=", ""), data.idMessage);
        socket.broadcast.to(activeRoom).emit("message", JSON.stringify({message: data.message, sender: token["username"], idMessage: data.idMessage}));
        return;
      }

      const idChat = await this.chatsService.getChatIdBySenderAndGetter(senderId, getterId);

      await this.chatsService.createChat(getterId, senderId, idChat);

      await this.messagesService.saveMessage(senderId, getterId, data.message, activeRoom.replace("activeRoom=", ""), data.idMessage);
      socket.broadcast.to(activeRoom).emit("message", JSON.stringify({message: data.message, sender: token["username"], idMessage: data.idMessage}));
  }

  @SubscribeMessage("delete-message")
  async deleteMessage(@MessageBody() idMessage: string, @ConnectedSocket() socket: Socket) {
    const senderId = (await jwt.verify(cookie.parse(socket.request.headers.cookie).token, secretJwt))["_id"];
    const activeRoom = [...socket.rooms].find(el => el.includes("activeRoom="));
    await this.messagesService.deleteMessage(idMessage, senderId);

    socket.broadcast.to(activeRoom).emit("delete-message", idMessage);
  }
}
