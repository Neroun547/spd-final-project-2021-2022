import { EntityRepository, Repository } from "typeorm";
import { Messages } from "./messages.entity";

@EntityRepository(Messages)
export class MessagesRepository extends Repository<Messages> {};