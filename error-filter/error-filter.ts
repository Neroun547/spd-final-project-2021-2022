import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class ErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        console.log(exception);
        if(exception instanceof HttpException) {
            ctx.getRequest<Request>();
            const status = exception.getStatus();

            if(status === 401 || status === 403) {
                response.redirect("/auth");

                return;
            }
            const errorMessage = exception instanceof HttpException ? exception.getResponse()["message"][0] : "Error";

            response.status(status).json({message: errorMessage });

            return;
        }
        response.sendStatus(500);
    }
}
