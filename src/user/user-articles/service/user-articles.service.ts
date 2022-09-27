import { Injectable } from "@nestjs/common";  
import { ArticlesServiceDb } from "db/articles/articles.service";
import { FriendsServiceDb } from "db/friends/friends.service";
import { FriendPendingServiceDb } from "db/friends-panding/friend-panding.service";
import { UserServiceDb } from "db/user/user.service";
import { IArticle } from "../interface/article.interface";

@Injectable()
export class UserArticlesService {
    constructor(
        private articlesServiceDb: ArticlesServiceDb,
        private userServiceDb: UserServiceDb,
        private friendsServiceDb: FriendsServiceDb,
        private friendPendingServiceDb: FriendPendingServiceDb
    ) {}

    async getIdAvatar(username: string){
        const user = await this.userServiceDb.findUserByUsername(username);
        return user.idAvatar;
    }

    async alreadyFriend(friendUsername: string, idUser: number) {
        const friendId = await this.userServiceDb.getIdUserByUsername(friendUsername);
        const alreadyFriend = await this.friendsServiceDb.alreadyFriends(idUser, friendId);
        const pendingFriend = await this.friendPendingServiceDb.findFriend(friendId, idUser);

        if(alreadyFriend) {
            return {
                accept: true,
                pending: false
            }
        }

        if(pendingFriend) {
            return {
                accept: false,
                pending: true
            }
        }

        return {
            accept: false,
            pending: false
        }
    }

    async getArticlesByUserId(publicateUser: number, skip: number, take: number): Promise<IArticle []> {
        const articles = await this.articlesServiceDb.getArticles(publicateUser, skip, take);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getArticlesByUsername(username: string, skip: number, take: number): Promise<IArticle[]> {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const articles = await this.articlesServiceDb.getArticles(user._id, skip, take);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getCountArticles(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username);
        return await this.articlesServiceDb.getCountArticles(user._id);
    }

    async getArticle(idArticle: string) {
        return await this.articlesServiceDb.getArticleById(idArticle);
    }

    async getArticlesByUsernameAndTheme(username: string, theme: string, skip: number, take: number): Promise<IArticle[]> {
        const userId = await this.userServiceDb.getIdUserByUsername(username);
        const articles = await this.articlesServiceDb.getArticlesByUsernameAndTheme(userId, theme, skip, take); 
        
        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }
}
