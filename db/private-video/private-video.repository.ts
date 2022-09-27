import { EntityRepository, Repository } from "typeorm";
import { PrivateVideo } from "./private-video.entity";

@EntityRepository(PrivateVideo)
export class PrivateVideoRepository extends Repository<PrivateVideo> {}
