export interface UploadPhoto {
    file: Express.Multer.File;
    theme: string;
    description: string;
    author: number;
}
