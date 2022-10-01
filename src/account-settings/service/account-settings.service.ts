import { BadRequestException, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { secretJwt } from "config.json";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { existsSync, createReadStream } from "fs";
import { unlink } from "fs/promises";
import { resolve } from "path";
import { UserServiceDb } from "db/user/user.service";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { email, passwordEmail } from "config.json";
import { host, appPort, protocol } from "config.json";

/* Don't good service ... maybe TODO -_-*/

@Injectable()
export class AccountSettingsService {
    constructor(private readonly userServiceDb: UserServiceDb) { };

    async uploadAvatar(file: Express.Multer.File, user, avatar: string): Promise<string> {
        const oldAvatar = await this.userServiceDb.findUserByEmail(user.email);

        if (existsSync(resolve(`avatars/${oldAvatar.avatar}`)) && oldAvatar.avatar) {
            await unlink(resolve(`avatars/${oldAvatar.avatar}`));
        }

        const idAvatar = uuidv4();

        await this.userServiceDb.updateAvatar(idAvatar, avatar, user.email);

        return jwt.sign({ ...user, idAvatar: idAvatar }, secretJwt);
    }

    async getAvatar(id: string, req: Request, res: Response): Promise<void> {
        const user = await this.userServiceDb.findUserByIdAvatar(id);
        
        if (existsSync(resolve(`avatars/${user.avatar}`))) {
            createReadStream(resolve(`avatars/${user.avatar}`)).pipe(res);

            return;
        }

        res.sendStatus(404);
    }

    async newName(user, name: string) {
        await this.userServiceDb.updateNameByEmail(user.email, name);

        const newToken = await jwt.sign({ ...user, name }, secretJwt);

        return newToken;
    }

    async newUserName(user, username: string) {
        const existUserByUsername = await this.userServiceDb.existUserByUsername(username);

        if(existUserByUsername) {
            throw new BadRequestException(["User the same username already exists"]);
        }

        await this.userServiceDb.updateUserNameByEmail(user.email, username);

        const newToken = await jwt.sign({ ...user, username }, secretJwt);

        return newToken;
    }

    async checkOldPassword(user, password: string) {
        const verify = await bcrypt.compare(password, user.password);

        if(!verify) {
            throw new BadRequestException(["Invalid password"]);
        }
    }

    async newPassword(user, password: string) {
        const newPassword = await bcrypt.hash(password, 10);
        const newToken = await jwt.sign({ ...user, changePassword: false, password: newPassword }, secretJwt);

        await this.userServiceDb.updatePasswordByEmail(user.email, newPassword);
        return newToken;
    }

    /*----*/

    async newEmail(user, emailUser: string) {
        const checkUserSameEmail = await this.userServiceDb.findUserByEmail(emailUser);

        if(checkUserSameEmail) {
            throw new BadRequestException(["User the same email already exists ..."]);
        }

        const token = await jwt.sign({ ...user, newEmail: emailUser, exp: Math.floor(Date.now() / 1000) + 60*5 }, secretJwt);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: email,
                pass: passwordEmail
            }
        });

        await transporter.sendMail({
            from: email,
            to: emailUser,
            subject: "Confirm your new email",
            html: `
        <h2>Hello ${user.name} ! Confirm your new email by click this link</h2>
        <a href="${protocol}://${host}:${appPort}/account-settings/confirm-new-email/${token}">Click for confirm your new email</a>`
        }); 
    }

    async confirmNewEmail(token: string) {
        const user = await jwt.verify(token, secretJwt);
        await this.userServiceDb.updateEmailByEmail(user["email"], user["newEmail"]);
        
        // @ts-ignore
        const newToken = jwt.sign({ ...user, email: user.newEmail }, secretJwt);

        return newToken;
    }
}