import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDto } from "../dto/user.dto";
import * as bcrypt from "bcrypt";
import { UserServiceDb } from "../../../db/user/user.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private userServiceDb: UserServiceDb, private jwtService: JwtService){}

    async auth(user: UserDto){
        const userInDb = await this.userServiceDb.findUserByUsername(user.username);

        if(!userInDb) {
            throw new BadRequestException(["Invalid username"]);
        }
        const verify = await bcrypt.compare(user.password, userInDb.password);

        if(!verify) {
            throw new BadRequestException(["Invalid password"]);
        }
        const token = this.jwtService.sign({...userInDb});
        return token;
    }
}
