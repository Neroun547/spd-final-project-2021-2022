import { Module } from '@nestjs/common';
import { SignUpController } from './signup.controller';
import { SignUpService } from "./service/signup.service";
import { UserEntityModule } from "../../entities/user/user.module";

@Module({
    imports:[UserEntityModule],
    controllers:[SignUpController],
    providers:[SignUpService]
})
export class SignupModule {}
