import { Module } from "@nestjs/common";
import { ModelsController } from "../controller/models.controller";
import { ModelsService } from "../service/models.service";
import { MinioModule } from "./minio.module";

@Module({
    imports: [
      MinioModule,
    ],
    controllers: [ModelsController],
    providers: [ModelsService],
    exports: [ModelsService]
  })
  export class ModelsModule {}