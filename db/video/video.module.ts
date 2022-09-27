import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoRepository } from "./video.repository";
import { VideoServiceDb } from "./video.service";

@Module({
    imports: [TypeOrmModule.forFeature([VideoRepository])],
    providers: [VideoServiceDb],
    exports: [VideoServiceDb]
})
export class VideoModuleDb {};
