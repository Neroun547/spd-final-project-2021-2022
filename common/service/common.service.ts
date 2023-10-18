import { Injectable } from "@nestjs/common";
import { unlink, access } from "fs/promises";
import {JwtService} from "@nestjs/jwt";
import { secretJwt } from "config.json";
import {UserInterface} from "../../db/user/interfaces/user.interface";
import { Request } from "express";

@Injectable()
export class CommonService {
    constructor(private jwtService: JwtService) {
    }

    async deleteFiles(fileNames: Array<string>) {
        for(let i = 0; i < fileNames.length; i++) {
            try {
                await access(fileNames[i]);
                await unlink(fileNames[i]);
            } catch {

            }
        }
    }
    async getAuthUserFromRequest(req: Request): Promise<UserInterface | boolean | object> {
        try {
            return await this.jwtService.verifyAsync(req.cookies["token"], { secret: secretJwt });
        } catch(e) {
            return false;
        }
    }
}
