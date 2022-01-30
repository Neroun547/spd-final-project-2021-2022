import { Injectable } from "@nestjs/common"; 
import { UserService } from "../../entities/user/user.service";
import { PhotoService } from "../../entities/photo/photo.service";
import { MusicsService } from "../../entities/musics/musics.service";
import { VideoService } from "../../entities/video/video.service"; 
import { FriendPandingService } from "../../entities/friendsPanding/friendPanding.service";
import { FriendsService } from "../../entities/friends/friends.service";

@Injectable()
export class AnotherUserService {
    constructor(
        private readonly userService: UserService,
        private readonly photoService: PhotoService,
        private readonly musicsService: MusicsService, 
        private readonly videoService: VideoService,
        private readonly friendPandingService: FriendPandingService,
        private readonly friendsService: FriendsService
    ) {};

    async getIdAvatar(username: string){
        const user = await this.userService.findUserByUsername(username);
        return user.idAvatar;
    }

    async getPhotoId(username: string) {
        const dataUserPhoto = await this.photoService.findPhotoByUsername(username);

        return dataUserPhoto.filter((el) => ({
            idPhoto: el.idPhoto,
            description: el.description,
            theme: el.theme
        }));
    }

    async getMusicUserId(username: string) {
        const dataUserMusic = await this.musicsService.getMusics(0, 5, username);

        return dataUserMusic.filter((el) => ({
            idMusic: el.idMusic,
            name: el.name,
            author: el.author
        }));
    }

    async getVideoId(username: string) {
        const dataUserVideo = await this.videoService.getVideo(username, 2, 0);

        return dataUserVideo.filter((el) => ({
            idVideo: el.idVideo,
            description: el.description,
            name: el.name
        }));
    }

    async addFriend(friendUsername: string, idUser: number) {
        const friendId = await this.userService.getIdUserByUsername(friendUsername);

        await this.friendPandingService.addFriend(friendId, idUser);
    }

    async alreadyFriend(friendUsername: string, idUser: number) {
        const friendId = await this.userService.getIdUserByUsername(friendUsername);
        const alreadyFriend = await this.friendsService.alreadyFriends(idUser, friendId);
        const pendingFriend = await this.friendPandingService.findFriend(friendId, idUser);

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

    async loadMorePhoto(username: string, skip: number) {
        return (await this.photoService.loadMorePhoto(username, skip, 4)).filter((el) => ({
            idPhoto: el.idPhoto,
            description: el.description,
            theme: el.theme
        }));
    }

    async getCountVideo(username: string) {
        return await this.videoService.getCountVideo(username);
    }

    async loadMoreVideoId(username: string, skip: number) {
        return (await this.videoService.getVideo(username, 2, skip)).filter(el => ({
            idVideo: el.idVideo,
            name: el.name,
            description: el.description
        }));
    }

    async loadMoreMusicId(username: string, skip: number) {
        const musics = await this.musicsService.getMusics(skip, 5, username);
        return musics.filter((el) => ({
            idMusic: el.idMusic,
            author: el.author,
            name: el.name
        }));
    }

    async getCountMusic(username: string) {
        return await this.musicsService.getCountMusics(username);
    }

    async getCountPhoto(author: string) {
        return await this.photoService.getCountPhoto(author);
    }
}
