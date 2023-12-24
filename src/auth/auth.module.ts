import { Module } from '@nestjs/common';
import { AuthController } from "./auth.controller";
import { AuthService } from "./service/auth.service";
import { UserModuleDb } from "../../db/user/user.module";
import {JwtModule} from "@nestjs/jwt";
import { secretJwt, expJwt } from "../../config.json";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports:[
        UserModuleDb,
        JwtModule.register({ secret: secretJwt, signOptions: { expiresIn: expJwt } })
    ],
    controllers:[AuthController],
    providers:[AuthService, JwtStrategy]
})
export class AuthModule {}
