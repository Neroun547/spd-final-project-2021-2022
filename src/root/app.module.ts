import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AccountSettingsModule } from "../accountSettings/account-settings.module";
import { SignupModule } from "../signup/signup.module";
import { SigninModule } from "../signin/signin.module";
import { MyPhotoModule } from "../myPhoto/myPhoto.module";
import { MyMusicsModule } from "../myMusics/myMusics.module";
import { RouterModule } from "@nestjs/core";
import { AppService } from "./app.service";
import { User } from "../../entities/user/user.entity";
import { UserEntityModule } from "../../entities/user/user.module";
import { MyVideoModule } from "../myVideo/myVideo.module";
import { UserModule } from "../user/AnotherUser.module";
import { AddFriendModule } from "../add-friend/add-friend.module";
import { FriendsModule } from "../friends/friends.module";
import { ChatModule } from "../chat/chat.module";
import { AppMiddleware } from "../../middleware/middleware";

import { passwordDB, hostDB, usernameDB, database, portDB, synchronize, autoLoadEntities } from "config.json";
@Module({
    imports:[
        ChatModule,
        AddFriendModule,
        UserModule,
        MyVideoModule,
        UserEntityModule,
        AccountSettingsModule,
        SigninModule,
        SignupModule,
        MyPhotoModule,
        MyMusicsModule,
        FriendsModule,
        RouterModule.register([
            {
                path: "/account-settings",
                module: AccountSettingsModule
            },
            {
                path: "/my-photo",
                module: MyPhotoModule
            },
            {
                path: "/signin",
                module: SigninModule
            },
            {
                path: "/signup",
                module: SignupModule
            }, 
            {
                path: "/my-musics",
                module: MyMusicsModule
            },
            {
                path: "/my-video",
                module: MyVideoModule
            },
            {
                path: "/user",
                module: UserModule
            },
            {
                path: "/add-friend",
                module: AddFriendModule
            },
            {
                path: "/my-friends",
                module: FriendsModule
            },
            {
                path: "/chat",
                module: ChatModule
            }
        ]),
        
        TypeOrmModule.forRoot({
            type: "mysql",
            host: hostDB,
            port: portDB,
            username: usernameDB,
            password: passwordDB,
            database: database,
            entities: [User],
            synchronize: synchronize,
            autoLoadEntities: autoLoadEntities,
        }),

        TypeOrmModule.forFeature([User])
    ],
    controllers:[AppController],
    providers:[AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AppMiddleware)
        .forRoutes("*")
    }
}
