import { EntityRepository, Repository } from "typeorm";
import { Music } from "./music.entity";

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {}