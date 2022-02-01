import { Injectable } from '@nestjs/common';
import { UserService } from "../../entities/user/user.service";

@Injectable()
export class AppService {
    constructor(private readonly userService: UserService){}

    async searchUser(username: string, count: number, skip: number) {
        
        if(!username.trim()){
            return [];
        }
        
        const users = await this.userService.findUsersByUsername(username, count, skip);
        
        return { 
            loadMore: users.length > 4 ? true : false,
            users: users.map((el) => ({username:el.username, idAvatar:el.idAvatar}))
        };
    }
}
