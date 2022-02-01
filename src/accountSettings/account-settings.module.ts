import { Module } from "@nestjs/common";
import { AccountSettingsController } from "./account-settings.controller";
import { AccountService } from "./service/account.service";
import { UserEntityModule } from "../../entities/user/user.module";

@Module({
    imports:[UserEntityModule],
    controllers:[AccountSettingsController],
    providers:[AccountService]
})
export class AccountSettingsModule{};