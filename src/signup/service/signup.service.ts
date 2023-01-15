import { BadRequestException, Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";
import { secretJwt } from "config.json";
import { UserDto } from "../dto/user.dto";
import * as bcrypt from "bcrypt";
import { UserServiceDb } from "db/user/user.service";
import { Response } from "express";
import { passwordEmail, email } from "config.json";
import { host, appPort, protocol } from "config.json";

@Injectable()
export class SignUpService {
    constructor(private userServiceDb: UserServiceDb) { }

    async signUp(createUserDto: UserDto, res: Response) {
        const user = {...createUserDto};
        const checkInDb = await this.userServiceDb.existsUser(createUserDto.username, createUserDto.email);

        if(checkInDb){
            throw new BadRequestException(["User the same params already exists"]);
        }

        user.password = await bcrypt.hash(createUserDto.password, 10);
        // So.. token may use 5 minutes
        const token = jwt.sign({...user}, secretJwt, {expiresIn: 60 * 5});

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
            to: createUserDto.email.trim(),
            subject: "Confirm account",
            html: `
            <h2>Hello ${createUserDto.name} ! Confirm your account by click this link</h2>
            <a href="${protocol}://${host}:${appPort}/signup/confirm-account/${token}">Click for confirm your account</a>`
        });

        res.send({message: "Message send in your email"})
    }

    async confirmAccount(token: string) {
        try {
            const user = await jwt.verify(token, secretJwt);
            await this.userServiceDb.saveUser(user);
        } catch {
            throw new BadRequestException(["Bad link ..."]);
        }
    }
}
