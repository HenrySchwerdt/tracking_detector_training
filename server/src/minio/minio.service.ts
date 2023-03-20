import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

const TRAINING_DATA_BUCKET_NAME = "training-data";
const MODEL_BUCKET = "models"

@Injectable()
export class MinioService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) { }
  private static initBucket(name: string, minioClient: Client) {
    var versioningStateConfig = {Status:"Enabled"}
    minioClient.bucketExists(name, (err, exists) => {
      if (err) {
        console.log(err);
      }
      if (!exists) {
        minioClient.makeBucket(name, "eu-central-1", (err) => {
          if (err) {
            console.log("error creating bucket")
          } else {
            console.log("Created Bucket.")
            minioClient.setBucketVersioning(name, versioningStateConfig, function (error){
              if (error) {
                return console.log(error)
              }
              console.log("Success")
            })
          }
        })
      }
    })
  }
  onModuleInit(): void {
    MinioService.initBucket(TRAINING_DATA_BUCKET_NAME, this.minioClient);
    MinioService.initBucket(MODEL_BUCKET, this.minioClient);
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




