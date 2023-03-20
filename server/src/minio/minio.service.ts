import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

const TRAINING_DATA_BUCKET_NAME = "trainingData";
const MODEL_BUCKET = "models"

@Injectable()
export class MinioService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  onModuleInit(): void {
    this.minioClient.makeBucket(TRAINING_DATA_BUCKET_NAME, "eu-central-1", (err) => {
      console.log("Error", err)
    })
    this.minioClient.makeBucket(MODEL_BUCKET, "eu-central-1", (err) => {
      console.log("Error", err)
    })
  }

  putTrainingCompressedTrainingData(filePath: string) {
    this.minioClient
  }
}




