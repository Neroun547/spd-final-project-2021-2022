export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    idAvatar: string;
    changePassword?: boolean;
}