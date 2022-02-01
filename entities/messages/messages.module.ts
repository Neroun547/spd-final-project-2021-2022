import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesRepository } from "./messages.repository";
import { MessagesService } from "./messages.service";

@Module({
    imports: [TypeOrmModule.forFeature([MessagesRepository])],
    providers: [MessagesService],
    exports: [MessagesService]
})
export class MessagesEntityModule {};
