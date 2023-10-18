import { Module } from "@nestjs/common";
import {CommonService} from "./service/common.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [JwtModule],
    providers: [CommonService],
    exports: [CommonService]
})
export class CommonModule {}
