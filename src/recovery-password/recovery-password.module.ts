import { Module } from "@nestjs/common"; 
import { RecoveryPasswordController } from "./recovery-password.controller";
import { UserModuleDb } from "db/user/user.module";
import { RecoveryPasswordService } from "./service/recovery-password.service";

@Module({
    imports: [UserModuleDb],
    controllers: [RecoveryPasswordController],
    providers: [RecoveryPasswordService]
})
export class RecoveryPasswordModule {};
