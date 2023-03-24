import { Module } from "@nestjs/common";
import { MinioModule } from "src/minio/minio.module";
import { ModelsController } from "./models.controller";
import { ModelsService } from "./models.service";

@Module({
    imports: [
      MinioModule,
    ],
    controllers: [ModelsController],
    providers: [ModelsService],
    exports: [ModelsService]
  })
  export class ModelsModule {}