import { Injectable } from "@nestjs/common";
import { UserServiceDb } from "db/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class RecoveryPasswordService {
    constructor(private userServiceDb: UserServiceDb) {};

    async checkEmail(email: string) {
        const checkEmail = await this.userServiceDb.findUserByEmail(email);
        
        return checkEmail;
    }

    async newPassword(email: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        
        await this.userServiceDb.updatePasswordByEmail(email.trim(), hash);
    }
}
