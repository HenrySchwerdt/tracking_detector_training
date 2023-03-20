import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

@Injectable()
export class MinioService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}
}




