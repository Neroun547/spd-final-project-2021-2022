import { EntityRepository, Repository } from "typeorm"; 
import { Friends } from "./friends.entity";

@EntityRepository(Friends)
export class FriendsRepository extends Repository<Friends> {};
