import { Photo } from "../../../entities/photo/photo.entity";
import { PhotoRepository } from "../../../entities/photo/photo.repository";
import { PhotoService } from "../../../entities/photo/photo.service";
import { MyPhotoService } from "../service/myPhoto.service";

describe("My Photo Service", () => {
    let myPhotoService: MyPhotoService;
    let photoServiceDb: PhotoService;

    beforeAll(async () => {
        photoServiceDb = new PhotoService(new PhotoRepository());
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