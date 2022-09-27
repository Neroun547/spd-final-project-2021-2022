import { Module } from "@nestjs/common";
import { MyVideoController } from "./my-video.controller";
import { VideoModuleDb } from "../../db/video/video.module";
import { PrivateVideoModuleDb } from "db/private-video/private-video.module";
import { MyVideo } from "./service/my-video.service";

@Module({
    imports: [VideoModuleDb, PrivateVideoModuleDb],
    controllers: [MyVideoController],
    providers: [MyVideo]
})
export class MyVideoModule {};
