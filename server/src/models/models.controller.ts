import { Controller, Get, Param, Res, StreamableFile } from "@nestjs/common";
import { Response } from "express";
import { MinioService } from "src/minio/minio.service";
import { ModelsService } from "./models.service";

@Controller('tracking-detector/models')
export class ModelsController {
    constructor (private readonly modelsService: ModelsService) {}

    @Get("data/:modelId/:resource")
    async getModelData(@Param('modelId') modelId: string, @Param('resource') resource: string, @Res() res: Response): Promise<ReadableStream> {
        const stream =  await this.modelsService.getFileFromModel(modelId, resource);
        return stream
    }

    @Get("data")
    async getModelsInBucket() {
        return await this.modelsService.getAllModelsByFolderAndName()
    }
}