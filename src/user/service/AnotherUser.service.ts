import { Injectable } from "@nestjs/common"; 
import { UserService } from "../../../entities/user/user.service";
import { PhotoService } from "../../../entities/photo/photo.service";
import { MusicsService } from "../../../entities/musics/musics.service";
import { VideoService } from "../../../entities/video/video.service"; 
import { FriendPandingService } from "../../../entities/friendsPanding/friendPanding.service";
import { FriendsService } from "../../../entities/friends/friends.service";
import { ArticlesService } from "entities/articles/articles.service";

@Injectable()
export class AnotherUserService {
    constructor(
        private readonly userServiceDb: UserService,
        private readonly photoServiceDb: PhotoService,
        private readonly musicsServiceDb: MusicsService, 
        private readonly videoServiceDb: VideoService,
        private readonly friendPandingServiceDb: FriendPandingService,
        private readonly friendsServiceDb: FriendsService,
        private readonly articlesServiceDb: ArticlesService
    ) {};

    async getIdAvatar(username: string){
        const user = await this.userServiceDb.findUserByUsername(username);
        return user.idAvatar;
    }

    async getPhotoId(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const dataUserPhoto = await this.photoServiceDb.findPhotoById(user._id);

        return dataUserPhoto.map((el) => ({
            idPhoto: el.idPhoto,
            description: el.description,
            theme: el.theme
        }));
    }

    async getMusicUserId(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const dataUserMusic = await this.musicsServiceDb.getMusics(0, 5, user._id);

        return dataUserMusic.map((el) => ({
            idMusic: el.idMusic,
            name: el.name,
            author: el.author
        }));
    }

    async getVideoId(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const dataUserVideo = await this.videoServiceDb.getVideo(user._id, 2, 0);

        return dataUserVideo.map((el) => ({
            idVideo: el.idVideo,
            description: el.description,
            name: el.name
        }));
    }

    async addFriend(friendUsername: string, idUser: number) {
        const friendId = await this.userServiceDb.getIdUserByUsername(friendUsername);

        await this.friendPandingServiceDb.addFriend(friendId, idUser);
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

    async getArticles(username: string, skip: number) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const articles = await this.articlesServiceDb.getArticles(user._id, skip, 5);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getCountArticles(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username);
        return await this.articlesServiceDb.getCountArticles(user._id);
    }

    async loadMorePhotoId(username: string, skip: number) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        return (await this.photoServiceDb.loadMorePhoto(user._id, skip, 4)).map((el) => ({
            idPhoto: el.idPhoto,
            description: el.description,
            theme: el.theme
        }));
    }

    async getCountVideo(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        return await this.videoServiceDb.getCountVideo(user._id);
    }

    async loadMoreVideoId(username: string, skip: number) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        
        return (await this.videoServiceDb.getVideo(user._id, 2, skip)).map(el => ({
            idVideo: el.idVideo,
            name: el.name,
            description: el.description
        }));
    }

    async loadMoreMusicId(username: string, skip: number) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const musics = await this.musicsServiceDb.getMusics(skip, 5, user._id);
        
        return musics.map((el) => ({
            idMusic: el.idMusic,
            author: el.author,
            name: el.name
        }));
    }

    async getCountMusic(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        
        return await this.musicsServiceDb.getCountMusics(user._id); 
    }

    async getCountPhoto(author: string) {
        const user = await this.userServiceDb.findUserByUsername(author); 

        return await this.photoServiceDb.getCountPhoto(user._id);
    }
}
