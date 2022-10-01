import { Module } from "@nestjs/common";
import { AccountSettingsController } from "./account-settings.controller";
import { AccountSettingsService } from "./service/account-settings.service";
import { UserModuleDb } from "../../db/user/user.module";

@Module({
    imports:[UserModuleDb],
    controllers:[AccountSettingsController],
    providers:[AccountSettingsService]
})
export class AccountSettingsModule{};