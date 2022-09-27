import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrivateVideoRepository } from "./private-video.repository";
import { PrivateVideoServiceDb } from "./private-video.service";

@Module({
    imports: [TypeOrmModule.forFeature([PrivateVideoRepository])],
    providers: [PrivateVideoServiceDb],
    exports: [PrivateVideoServiceDb]
})

export class PrivateVideoModuleDb {};
