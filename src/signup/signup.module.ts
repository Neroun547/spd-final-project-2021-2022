import { Module } from '@nestjs/common';
import { SignUpController } from './signup.controller';
import { SignUpService } from "./service/signup.service";
import { UserModuleDb } from "../../db/user/user.module";
import {MailerModule} from "@nestjs-modules/mailer";

@Module({
    imports:[UserModuleDb, MailerModule],
    controllers:[SignUpController],
    providers:[SignUpService]
})
export class SignupModule {}
