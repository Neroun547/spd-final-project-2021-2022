import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { FriendPending } from "../friends-pending/friend-pending.entity";
import { Friends } from "../friends/friends.entity";
import { Chats } from "../chats/chats.entity";

@Injectable()
export class UserServiceDb {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository){};

    async saveUser(user) {
        await this.userRepository.save(user);
    }

    async existsUser(username: string, email: string) {
        return await this.userRepository.
            createQueryBuilder()
            .where("username = :username OR email = :email", {
                username: username,
                email: email
            })
            .getOne();
    }

    async existUserByUsername(username: string) {
        return await this.userRepository.findOne({ username });
    }

    async findUserByUsername(username: string) {
        return await this.userRepository.findOne({ username:username });
    }

    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({ email: email });
    }

    async updateAvatar(idAvatar: string, filename: string, email: string) {
        await this.userRepository.createQueryBuilder()
            .update(User)
            .set({ idAvatar: idAvatar, avatar: filename })
            .where("email = :email", { email: email })
            .execute();
    }

    async findUserByIdAvatar(idAvatar: string) {
        return await this.userRepository.findOne({ idAvatar: idAvatar });
    }

    async updateNameByEmail(email: string, name: string) {
        await this.userRepository.update({ email: email }, { name: name });
    }

    async updateUserNameByEmail(email: string, username: string) {
        await this.userRepository.update({ email: email }, { username: username });
    }

    async updatePasswordByEmail(email: string, password: string) {
        await this.userRepository.update({ email: email }, { password: password });
    }

    async updateEmailByEmail(email: string, newEmail: string) {
        await this.userRepository.update({ email: email }, { email: newEmail })
    }

    async findUsersByUsername(username: string, count: number, skip: number) {
        return await this.userRepository.createQueryBuilder("user")
        .where("user.username LIKE :username", { username:`%${username.trim()}%` })
        .take(count)
        .skip(skip)
        .getMany();
    }

    async getIdUserByUsername(username: string) {
        return (await this.userRepository.findOne({ username: username }))._id;
    }

    async findUserById(_id: number) {
        return await this.userRepository.findOne(_id);
    }

    async getFriendsInviteAccount(idGetter: number, count: number, skip: number) {
        return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect(FriendPending, 'friend_panding', 'user._id = friend_panding.idSender')
        .andWhere(`friend_panding.idGetter = ${idGetter}`)
        .take(count)
        .skip(skip)
        .getMany();
    }

    async getFriendsAccount(idGetter: number, count: number, skip: number) {
        return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect(Friends, 'friends', 'user._id = friends.friend')
        .andWhere(`friends.user = ${idGetter}`)
        .take(count)
        .skip(skip)
        .getMany();
    }

    async getCountFriends(idGetter: number) {
        return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect(Friends, 'friends', 'user._id = friends.friend')
        .andWhere(`friends.user = ${idGetter}`)
        .getCount();
    }

    async getUsersChatsAccount(sender: number) {
        return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect(Chats, 'chats', 'user._id = chats.getter')
        .andWhere(`chats.sender = ${sender}`)
        .getMany();
    }

    async deleteUserById(id: number) {
        await this.userRepository.delete({ _id: id });
    }
}
