export interface IArticle {
    _id?:number;
    article: string;
    idArticle: string;
    theme: string;
    title: string;
    publicateUser: number;
    date: Date;
}