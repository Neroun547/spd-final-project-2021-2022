import { Module } from "@nestjs/common";
import { MyVideoController } from "./myVideo.controller";
import { VideoEntityModule } from "../../entities/video/video.module";
import { PrivateVideoEntityModule } from "entities/privateVideo/privateVideo.module";
import { MyVideo } from "./service/myVideo.service";

@Module({
    imports: [VideoEntityModule, PrivateVideoEntityModule],
    controllers: [MyVideoController],
    providers: [MyVideo]
})
export class MyVideoModule {};
