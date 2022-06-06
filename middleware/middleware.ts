import { NestMiddleware, Injectable } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { secretJwt } from "config.json";
import * as jwt from "jsonwebtoken"; 

@Injectable()
export class AppMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if(req.originalUrl.includes("signin") || req.originalUrl.includes("signup") || req.originalUrl.includes("/recovery-password")) {
            try {
                await jwt.verify(req.cookies.token, secretJwt);
                res.redirect("/");
            } catch {
                next();
            }
      
            return;
        }
      
        if(req.originalUrl === "/search-user" || req.originalUrl === "/" || req.originalUrl.includes("/user")) {
            try {
                const user = await jwt.verify(req.cookies.token, secretJwt);
                req["user"] = user;
              
                next();
            } catch {
                next();
            }
      
            return;
        }

        if(req.originalUrl === "/check-token-interval") {
            try {
                const user = await jwt.verify(req.cookies.token, secretJwt);
                req["user"] = user;
            
                next();
            } catch {
                res.sendStatus(400);
            }

            return;
        }
        
        if(req.originalUrl.includes("/account-settings/avatar")) {
            try {
                const user = await jwt.verify(req.cookies.token, secretJwt);
                req["user"] = user;
              
                next();
            } catch {
                next();
            }
      
            return;
        }
          
        try {
            const user = await jwt.verify(req.cookies.token, secretJwt);
            req["user"] = user;
            
            next();
        } catch {
            res.redirect("/signin");
        }
    }
}
