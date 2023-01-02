import { Module } from "@nestjs/common";
import {CommonService} from "./service/common.service";

@Module({
    providers: [CommonService],
    exports: [CommonService]
})
export class CommonModule {}
