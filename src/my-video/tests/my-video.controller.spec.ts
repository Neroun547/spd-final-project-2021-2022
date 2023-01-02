import { Test, TestingModule } from '@nestjs/testing';
import { MyVideoController } from "../my-video.controller";
import { MyVideo } from "../service/my-video.service";
import { request } from "express";
import { INestApplication } from '@nestjs/common';

describe("myVideoController", () => {
  let module: TestingModule;  
  let controller: MyVideoController;
  let myVideoService: MyVideo;
  let app: INestApplication;  

  const mockMyVideoService = {
    getPrivateVideoId: jest.fn((id: number, count: number, skip: number) => {
      if(skip > 5) {
        return {
          video: []
        };
      }
      // It's test value
      return {
        video: [{ name: "TEST", video: "TEST", description: "TEST" }]
      }
    }),
    makePrivateVideo: jest.fn((idVideo, idUser) => {
      return true;
    }),
    changeParamsVideo: jest.fn((publicateUser: number, name: string, description: string, idVideo: string, isPrivate: boolean) => {
      return true;
    })
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MyVideoController],
      providers: [MyVideo]
    }).overrideProvider(MyVideo).useValue(mockMyVideoService).compile();

    controller = module.get<MyVideoController>(MyVideoController);
    myVideoService = module.get<MyVideo>(MyVideo);

    app = module.createNestApplication();
    await app.init();
  });


  it("Should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("change params private video", async () => {
    request["user"] = {
      _id: 34
    };
    request["params"] = {
      id: "213"
    };
    expect(await controller.changeParamsPrivateVideo({ name: "TEST", description: "TEST" }, request)).toEqual({ message: "Params was updated success" });
  });

  it("change params public video", async () => {
    expect(await controller.changeParamsVideo({ name: "TEST", description: "TEST" }, request)).toEqual({ message: "Params was updated success" });
  });

  it("load more private (If empty)", async () => {
    request["user"] = {
      _id: 34
    };
    let result = {
      video: []
    };
    expect(await controller.loadMorePrivate(request, 6))
    .toEqual(result)
  });

  it("load more private", async () => {
    request["user"] = {
      _id: 34
    };
    let result =  {
      video: [{ name: "TEST", video: "TEST", description: "TEST" }]
    }
    expect(await controller.loadMorePrivate(request, 0))
    .toEqual(result)
  });
});

