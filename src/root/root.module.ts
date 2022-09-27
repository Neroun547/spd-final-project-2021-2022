import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RootController } from "./root.controller";
import { AccountSettingsModule } from "../account-settings/account-settings.module";
import { SignupModule } from "../signup/signup.module";
import { AuthModule } from "../auth/auth.module";
import { MyPhotoModule } from "../my-photo/my-photo.module";
import { MyMusicsModule } from "../my-musics/my-musics.module";
import { RouterModule } from "@nestjs/core";
import { RootService } from "./root.service";
import { User } from "../../db/user/user.entity";
import { UserModuleDb } from "../../db/user/user.module";
import { MyVideoModule } from "../my-video/my-video.module";
import { UserModule } from "../user/user.module";
import { AddFriendModule } from "../add-friend/add-friend.module";
import { FriendsModule } from "../friends/friends.module";
import { ChatModule } from "../chat/chat.module";
import { MyArticle } from "../my-articles/my-articles.module";
import { passwordDB, hostDB, usernameDB, database, portDB, synchronize, autoLoadEntities } from "config.json";
import { UserArticlesModule } from "src/user/user-articles/user-articles.modules";
import { UserMusicModule } from "src/user/user-musics/user-musics.module";
import { UserPhotoModule } from "src/user/user-photo/user-photo.module";
import { UserVideoModule } from "src/user/user-video/user-video.module";
import { RecoveryPasswordModule } from "src/recovery-password/recovery-password.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports:[
        MyArticle,
        ChatModule,
        AddFriendModule,
        UserModule,
        MyVideoModule,
        UserModuleDb,
        AccountSettingsModule,
        AuthModule,
        SignupModule,
        MyPhotoModule,
        MyMusicsModule,
        FriendsModule,
        RecoveryPasswordModule,
        UserModule,
        JwtModule,
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
                path: "/auth",
                module: AuthModule
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
                module: UserModule,
                children: [
                    { 
                        path: "articles",
                        module: UserArticlesModule
                    }, 
                    {
                        path: "music",
                        module: UserMusicModule
                    },
                    {
                        path: "photo",
                        module: UserPhotoModule
                    },
                    {
                        path: "video",
                        module: UserVideoModule
                    }
                ]
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
            },
            {
                path: "/my-articles",
                module: MyArticle
            },
            {
                path: "/recovery-password",
                module: RecoveryPasswordModule
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
            charset: "utf8mb4"
        }),

        TypeOrmModule.forFeature([User])
    ],
    controllers:[RootController],
    providers:[RootService]
})
export class RootModule {}
