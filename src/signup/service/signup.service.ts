import { BadRequestException, Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";
import { secretJwt } from "config.json";
import { UserDto } from "../dto/user.dto";
import * as bcrypt from "bcrypt";
import { UserService } from "src/entities/user/user.service";
import { Response } from "express";
import { passwordEmail, email } from "config.json";
import { host, appPort } from "config.json";

@Injectable()
export class SignUpService {
    constructor(private userService: UserService) { }

    async signUp(createUserDto: UserDto, res: Response) {
        const user = {...createUserDto};
        const checkInDb = await this.userService.existsUser(createUserDto.username, createUserDto.email);

        if(checkInDb){
            throw new BadRequestException(["User the same params already exists"]);
        }

        user.password = await bcrypt.hash(createUserDto.password, 10);
        // So.. token may use 5 minutes    
        const token = jwt.sign({...user}, secretJwt, { expiresIn: 60*5 });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: false,
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
            <a href="http://${host}:${appPort}/signup/confirm-account/${token}">Click for confirm your account</a>`
            });

        
        res.send({message: "Message send in your email"})
    }

    async confirmAccount(token: string) {
        const user: UserDto = await jwt.verify(token, secretJwt);  
        await this.userService.saveUser(user);
    }
}
