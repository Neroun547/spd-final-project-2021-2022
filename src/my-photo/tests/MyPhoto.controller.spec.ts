import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing"
import { MyPhotoController } from "../my-photo.controller";
import { MyPhotoService } from "../service/myPhoto.service";

describe("My Photo controller", () => {
    let module: TestingModule;
    let app: INestApplication;
    let controller: MyPhotoController;

    const mockImplementation = {
        deletePhoto: jest.fn((id: number, author: number) => {
        })
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            controllers: [MyPhotoController],
            providers: [MyPhotoService]
        }).overrideProvider(MyPhotoService).useValue(mockImplementation).compile();

        app = module.createNestApplication();
        controller = module.get<MyPhotoController>(MyPhotoController); 

        await app.init();
    });

    it("Should be defined", () => {
        expect(controller).toBeDefined();
    });
});
