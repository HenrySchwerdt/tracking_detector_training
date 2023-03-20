import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { join } from 'path';

const TRAINING_DATA_BUCKET_NAME = "training-data";
const MODEL_BUCKET = "models"

@Injectable()
export class MinioService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) { }

  onModuleInit(): void {
    this.minioClient.makeBucket(TRAINING_DATA_BUCKET_NAME, "eu-central-1", (err) => {
      console.log("Error", err)
    })
    this.minioClient.makeBucket(MODEL_BUCKET, "eu-central-1", (err) => {
      console.log("Error", err)
    })
  }

  async putTrainingCompressedTrainingData(filePath: string, metaData: any) {
    return new Promise((resolve, reject) => 
    this.minioClient.fPutObject(
      TRAINING_DATA_BUCKET_NAME,
      "training-data.csv.gz",
      filePath,
      metaData,
      (err, objInfo) => {
        if (err) {
          reject(err)
        }
        resolve(objInfo);
      }
    ))
  }
}




