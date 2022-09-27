import { Module } from "@nestjs/common";
import { AccountSettingsController } from "./account-settings.controller";
import { AccountService } from "./service/account.service";
import { UserModuleDb } from "../../db/user/user.module";

@Module({
    imports:[UserModuleDb],
    controllers:[AccountSettingsController],
    providers:[AccountService]
})
export class AccountSettingsModule{};