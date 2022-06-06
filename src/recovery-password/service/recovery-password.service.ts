import { Injectable } from "@nestjs/common";
import { UserService } from "entities/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class RecoveryPasswordService {
    constructor(private userService: UserService) {};

    async checkEmail(email: string) {
        const checkEmail = await this.userService.findUserByEmail(email);
        
        return checkEmail;
    }

    async newPassword(email: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        
        await this.userService.updatePasswordByEmail(email.trim(), hash);
    }
}
