import { FriendPanding } from "./friendPanding.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(FriendPanding)
export class FriendPandingRepository extends Repository<FriendPanding> {}
