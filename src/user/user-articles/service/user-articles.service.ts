import { Injectable } from "@nestjs/common";  
import { ArticlesService } from "entities/articles/articles.service";
import { FriendsService } from "entities/friends/friends.service";
import { FriendPandingService } from "entities/friendsPanding/friendPanding.service";
import { UserService } from "entities/user/user.service";

@Injectable()
export class UserArticlesService {
    constructor(
        private articlesServiceDb: ArticlesService,
        private userServiceDb: UserService,
        private friendsServiceDb: FriendsService,
        private friendPandingServiceDb: FriendPandingService
    ) {}

    async getIdAvatar(username: string){
        const user = await this.userServiceDb.findUserByUsername(username);
        return user.idAvatar;
    }

    async alreadyFriend(friendUsername: string, idUser: number) {
        const friendId = await this.userServiceDb.getIdUserByUsername(friendUsername);
        const alreadyFriend = await this.friendsServiceDb.alreadyFriends(idUser, friendId);
        const pendingFriend = await this.friendPandingServiceDb.findFriend(friendId, idUser);

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

    async getArticlesByUserId(publicateUser: number, skip: number, take: number) {
        const articles = await this.articlesServiceDb.getArticles(publicateUser, skip, take);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getArticlesByUsername(username: string, skip: number, take: number) {
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
}
