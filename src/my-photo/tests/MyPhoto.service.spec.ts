import { PhotoRepository } from "../../../db/photo/photo.repository";
import { PhotoServiceDb } from "../../../db/photo/photo.service";
import { MyPhotoService } from "../service/myPhoto.service";
import {Photo} from "../../../db/photo/photo.entity";

describe("My Photo Service", () => {
    let myPhotoService: MyPhotoService;
    let photoServiceDb: PhotoServiceDb;

    beforeAll(async () => {
        photoServiceDb = new PhotoServiceDb(new PhotoRepository());
        myPhotoService = new MyPhotoService(photoServiceDb);

        jest.spyOn(photoServiceDb, "findOneAndDelete").mockImplementation(async (id, author) => {
            return new Photo();
        })
    });

    it("Should be defined", () => {
        expect(myPhotoService).toBeDefined();
    });

    it("Should return Not Found Exception (404)", (done) => {
        myPhotoService.deletePhoto("222", 2222)
        .then((data) => {
            done.fail("Should return Not Found error (404)");
        })
        .catch((error) => {
            expect(error.status).toBe(404);
            done();
        })
    });
});