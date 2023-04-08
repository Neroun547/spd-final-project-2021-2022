import { Module } from "@nestjs/common";
import { AccountSettingsController } from "./account-settings.controller";
import { AccountSettingsService } from "./service/account-settings.service";
import { UserModuleDb } from "../../db/user/user.module";
import { MusicsModuleDb } from "../../db/musics/music.module";
import { PhotoModuleDb } from "../../db/photo/photo.module";
import { ArticlesModuleDb } from "../../db/articles/articles.module";
import { VideoModuleDb } from "../../db/video/video.module";
import { CommonModule } from "../../common/common.module";
import { PrivateVideoModuleDb } from "../../db/private-video/private-video.module";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [
        UserModuleDb,
        MusicsModuleDb,
        PhotoModuleDb,
        ArticlesModuleDb,
        VideoModuleDb,
        CommonModule,
        PrivateVideoModuleDb,
        MailerModule
    ],
    controllers: [AccountSettingsController],
    providers: [AccountSettingsService]
})
export class AccountSettingsModule{};
