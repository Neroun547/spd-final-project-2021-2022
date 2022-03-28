import { EntityRepository, Repository } from "typeorm";
import { privateVideoEntity } from "./privateVideo.entity";

@EntityRepository(privateVideoEntity)
export class PrivateVideoRepository extends Repository<privateVideoEntity> {}
