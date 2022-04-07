import { EntityRepository, Repository } from "typeorm";
import { Articles } from "./articles.entity";

@EntityRepository(Articles)
export class ArticlesRepository extends Repository<Articles> {};
