import { Injectable } from '@nestjs/common';
import { UserServiceDb } from "../../db/user/user.service";

@Injectable()
export class RootService {
    constructor(private readonly userServiceDb: UserServiceDb){}

    async searchUser(username: string, count: number, skip: number) {
        
        if(!username.trim()){
            return [];
        }
        
        const users = await this.userServiceDb.findUsersByUsername(username, count, skip);
        
        return { 
            loadMore: users.length > 4 ? true : false,
            users: users.map((el) => ({username:el.username, idAvatar:el.idAvatar}))
        };
    }
}
