import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesRepository } from "./messages.repository";
import { MessagesServiceDb } from "./messages.service";

@Module({
    imports: [TypeOrmModule.forFeature([MessagesRepository])],
    providers: [MessagesServiceDb],
    exports: [MessagesServiceDb]
})
export class MessagesModuleDb {};
