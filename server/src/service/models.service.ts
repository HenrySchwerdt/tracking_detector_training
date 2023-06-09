import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';

@Injectable()
export class ModelsService {
  constructor(private readonly minioService: MinioService) {}

  async getFileFromModel(modelName: string, fileName: string) {
    return this.minioService.getModelFilesByFolderAndName(modelName, fileName);
  }

  async getAllModelsByFolderAndName() {
    const models: any[] =
      await this.minioService.getAllModelsAvailableToDownload();
    const values = new Set(models.map((x) => x.name.split('/')[0]));
    console.log(values);
    const modelsObj = [];
    values.forEach((value) => {
      modelsObj.push({
        name: value,
        resources: models
          .filter((x) => x.name.split('/')[0] == value)
          .map((x) => ({ ...x, fileName: x.name.split('/')[1] })),
      });
    });

    return modelsObj;
  }
}
