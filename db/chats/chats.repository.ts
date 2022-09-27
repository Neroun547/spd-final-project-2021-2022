import { Chats } from "./chats.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Chats)
export class ChatsRepository extends Repository<Chats> {};
