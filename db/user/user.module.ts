import { Module } from "@nestjs/common";
import { UserServiceDb } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository"; 

@Module({
    imports:[TypeOrmModule.forFeature([UserRepository])],
    providers:[UserServiceDb],
    exports:[UserServiceDb]
})
export class UserModuleDb { };
