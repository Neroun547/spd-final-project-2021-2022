import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoRepository } from "./video.repository";
import { VideoService } from "./video.service";

@Module({
    imports: [TypeOrmModule.forFeature([VideoRepository])],
    providers: [VideoService],
    exports: [VideoService]
})
export class VideoEntityModule {};
