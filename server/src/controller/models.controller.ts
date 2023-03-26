import { Controller, Get, Param } from '@nestjs/common';
import { ModelsService } from '../service/models.service';

@Controller('tracking-detector/models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get('data/:modelId/:resource')
  async getModelData(
    @Param('modelId') modelId: string,
    @Param('resource') resource: string,
  ): Promise<ReadableStream> {
    const stream = await this.modelsService.getFileFromModel(modelId, resource);
    return stream;
  }

  @Get('data')
  async getModelsInBucket() {
    return await this.modelsService.getAllModelsByFolderAndName();
  }
}
