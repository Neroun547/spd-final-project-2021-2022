import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { secretJwt } from "config.json";

function cookieExtractor(req) {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies["token"];
    }
    return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            ignoreExpiration: false,
            secretOrKey: secretJwt,
        });
    }

    async validate(payload: any) {
        return {
            username: payload.username,
            idAvatar: payload.idAvatar,
            _id: payload._id,
            name: payload.name,
            avatar: payload.avatar,
            email: payload.email
        };
    }
}
