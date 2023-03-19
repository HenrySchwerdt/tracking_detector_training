import { Injectable } from '@nestjs/common';
import { Client, InjectMinio } from 'minio';

@Injectable()
export class MinioService {
  constructor(@InjectMinio() private readonly minioClient: Client) {}
}
