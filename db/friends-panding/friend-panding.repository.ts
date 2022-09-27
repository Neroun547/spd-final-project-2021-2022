import { FriendPending } from "./friend-panding.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(FriendPending)
export class FriendPendingRepository extends Repository<FriendPending> {}
