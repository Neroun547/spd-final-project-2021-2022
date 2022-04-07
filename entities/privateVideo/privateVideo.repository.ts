import { EntityRepository, Repository } from "typeorm";
import { PrivateVideo } from "./privateVideo.entity";

@EntityRepository(PrivateVideo)
export class PrivateVideoRepository extends Repository<PrivateVideo> {}
