import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrivateVideoRepository } from "./privateVideo.repository";
import { PrivateVideoService } from "./privateVideo.service";

@Module({
    imports: [TypeOrmModule.forFeature([PrivateVideoRepository])],
    providers: [PrivateVideoService],
    exports: [PrivateVideoService]
})

export class PrivateVideoEntityModule {};
