import { PrivateVideoRepository } from "../../../entities/privateVideo/privateVideo.repository";
import { VideoRepository } from "../../../entities/video/video.repository";
import { PrivateVideoService } from "../../../entities/privateVideo/privateVideo.service";
import { VideoService } from "../../../entities/video/video.service";
import { MyVideo } from "../service/myVideo.service";

describe("My video service", () => {
  let myVideoService: MyVideo;
  let videoServiceDb: VideoService;
  let privateVideoServiceDb: PrivateVideoService;
  
  beforeEach(() => {
    videoServiceDb = new VideoService(new VideoRepository())
    privateVideoServiceDb = new PrivateVideoService(new PrivateVideoRepository());
    myVideoService = new MyVideo(videoServiceDb, privateVideoServiceDb);

    jest.spyOn(privateVideoServiceDb, "getCountPrivateVideo").mockImplementation(async () => 5);
    jest.spyOn(privateVideoServiceDb, "getPrivateVideo").mockImplementation(async () => {
        return  [
            {   
                _id: 1,
                name: "TEST",
                description: "TEST",
                idVideo: "TEST",
                video: "TEST",
                publicateUser: 2
            },
            {   
                _id: 2,
                name: "TEST",
                description: "TEST",
                idVideo: "TEST",
                video: "TEST",
                publicateUser: 2
            }
        ]
    });
    jest.spyOn(videoServiceDb, "updateParamsVideo").mockImplementation(async () => {

    });
    jest.spyOn(videoServiceDb, "getVideoById").mockImplementation(async (idVideo: string) => {

        if(idVideo === "TEST") {
            return  {   
                _id: 1,
                name: "TEST",
                description: "TEST",
                idVideo: "TEST",
                video: "TEST",
                publicateUser: 2
            }
        }
    });
    jest.spyOn(privateVideoServiceDb, "updateParamsPrivateVideo").mockImplementation(async () => {

    });
    jest.spyOn(privateVideoServiceDb, "getPrivateVideoById").mockImplementation(async (idVideo: string) => {

        if(idVideo === "TEST") {
            return  {   
                _id: 1,
                name: "TEST",
                description: "TEST",
                idVideo: "TEST",
                video: "TEST",
                publicateUser: 2
            }
        }
    });
    jest.spyOn(videoServiceDb, "saveVideo").mockImplementation(async () => {

    })
    jest.spyOn(privateVideoServiceDb, "deletePrivateVideo").mockImplementation(async () => {
        return  {   
            _id: 1,
            name: "TEST",
            description: "TEST",
            idVideo: "TEST",
            video: "TEST",
            publicateUser: 2
        }
    })
  });

    it("Should be defined", () => {
        expect(myVideoService).toBeDefined();
    });

    it("Should return count private video", async () => {
        expect(await myVideoService.getCountPrivateVideo(34)).toBe(5);
    });

    it("Should return array private video", async () => {
        expect(await myVideoService.getPrivateVideoId(35, 2, 0)).toEqual([
            { name: "TEST", description: "TEST", idVideo: "TEST" }, 
            { name: "TEST", description: "TEST", idVideo: "TEST" }
        ])
    });

    it("Should update params public video (If it's invalid user)", (done) => {
        myVideoService.changeParamsVideo(1, "TEST", "TEST", "TEST", false)
        .then(() => done.fail("Should return Internal Server error but did not"))
        .catch((error) => {
          expect(error.status).toBe(500);
          done();
        });
    });

    it("Should update params private video (If it's invalid user)", (done) => {
        myVideoService.changeParamsVideo(1, "TEST", "TEST", "TEST", true)
        .then(() => done.fail("Should return Internal Server error but did not"))
        .catch((error) => {
          expect(error.status).toBe(500);
          done();
        });
    });

    it("Should update params public video (If video not found)", (done) => {
        myVideoService.changeParamsVideo(1, "TEST", "TEST", "", false)
        .then(() => done.fail("Should return Internal Server error but did not"))
        .catch((error) => {
          expect(error.status).toBe(404);
          done();
        });
    });

    it("Should update params private video (If video not found)", (done) => {
        myVideoService.changeParamsVideo(1, "TEST", "TEST", "", true)
        .then(() => done.fail("Should return Not found error but did not"))
        .catch((error) => {
          expect(error.status).toBe(404);
          done();
        });
    });

    it("Should update params public video", async () => {
        expect(await myVideoService.changeParamsVideo(2, "TEST", "TEST", "TEST", false)).toEqual(undefined);
    });

    it("Should update params private video", async () => {
        expect(await myVideoService.changeParamsVideo(2, "TEST", "TEST", "TEST", true)).toEqual(undefined);
    });

    it("Make public video", async () => {
        expect(await myVideoService.makePublicVideo("TEST", 2)).toEqual(undefined);
    });

    it("Make public video (Invalid user)", (done) => {
        myVideoService.makePublicVideo("TEST", 0)
        .then(() => done.fail("Should return Internal Server error"))
        .catch(error => {
            expect(error.status).toBe(500);
            done();
        });
    });

    it("Make public video (Invalid video id)", (done) => {
        myVideoService.makePublicVideo("TEST1", 0)
        .then(() => done.fail("Should return Not Found error"))
        .catch(error => {
            expect(error.status).toBe(404);
            done();
        });
    });
});
