import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { MinioService } from './minio.service';

@Module({
  imports: [
    NestMinioModule.register({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'trackingDetector',
      secretKey: 'Strong#Pass#2022',
    }),
  ],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
