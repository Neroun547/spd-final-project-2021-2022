import { FriendPending } from "./friend-pending.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(FriendPending)
export class FriendPendingRepository extends Repository<FriendPending> {}
