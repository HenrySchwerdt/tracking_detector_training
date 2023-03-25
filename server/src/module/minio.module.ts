import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { MinioService } from '../service/minio.service';

@Module({
  imports: [
    NestMinioModule.register({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_PRIVATE_KEY,
    }),
  ],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
