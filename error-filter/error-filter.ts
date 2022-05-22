import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class ErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
   
        if(exception instanceof HttpException) {
            const request = ctx.getRequest<Request>();
            const status = exception.getStatus();
            const errorMessage = exception instanceof HttpException ? exception.getResponse()["message"][0] : "Error";

            response.status(status).json({message: errorMessage });

            return;
        }
        response.sendStatus(500);
    }
}
