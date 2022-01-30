import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDto } from "../dto/user.dto";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { secretJwt } from "config.json";
import { UserService } from "src/entities/user/user.service";

@Injectable()
export class SignInService {
    constructor(private userService: UserService){}

    async signIn(user: UserDto){
        const userInDb = await this.userService.findUserByUsername(user.username);

        if(!userInDb) {
            throw new BadRequestException(["Invalid username"]);
        }

        const verify = await bcrypt.compare(user.password, userInDb.password);

        if(!verify) {
            throw new BadRequestException(["Invalid password"]);
        }

        const token = await jwt.sign({...userInDb}, secretJwt, { expiresIn: "6h" });
        
        return token;
    }
}
