import { EntityRepository, Repository } from "typeorm";
import { Music } from "./musics.entity";

@EntityRepository(Music)
export class MusicsRepository extends Repository<Music> {};