import { Module } from "@nestjs/common"; 
import { RecoveryPasswordController } from "./recovery-password.controller";
import { UserEntityModule } from "entities/user/user.module";
import { RecoveryPasswordService } from "./service/recovery-password.service";

@Module({
    imports: [UserEntityModule],
    controllers: [RecoveryPasswordController],
    providers: [RecoveryPasswordService]
})
export class RecoveryPasswordModule {};
