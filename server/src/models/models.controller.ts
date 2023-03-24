import { Controller, Get, Param } from "@nestjs/common";
import { MinioService } from "src/minio/minio.service";
import { ModelsService } from "./models.service";

@Controller('tracking-detector/models')
export class ModelsController {
    constructor (private readonly modelsService: ModelsService) {}

    @Get(":modelId/:resource")
    getModelData(@Param() params) {

    }

    @Get("data")
    async getModelsInBucket() {
        return await this.modelsService.getAllModelsByFolderAndName()
    }
}