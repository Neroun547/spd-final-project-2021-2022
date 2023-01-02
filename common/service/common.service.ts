import { Injectable } from "@nestjs/common";
import { unlink, access } from "fs/promises";

@Injectable()
export class CommonService {
    async deleteFiles(fileNames: Array<string>) {
        for(let i = 0; i < fileNames.length; i++) {
            try {
                await access(fileNames[i]);
                await unlink(fileNames[i]);
            } catch {

            }
        }
    }
}
