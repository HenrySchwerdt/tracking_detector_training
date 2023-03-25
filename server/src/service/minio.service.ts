import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';

const TRAINING_DATA_BUCKET = process.env.TRAINING_DATA_BUCKET_NAME;
const MODEL_BUCKET = process.env.MODEL_BUCKET_NAME;
const MONGO_DB_BACKUP_BUCKET = process.env.MONGO_DB_BACKUP_BUCKET_NAME;

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name)
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) { }


  private initBucket(name: string) {
    var versioningStateConfig = { Status: "Enabled" }
    this.minioClient.bucketExists(name, (err, exists) => {
      if (err) {
        this.logger.error(err);
      }
      if (!exists) {
        this.minioClient.makeBucket(name, "eu-central-1", (err) => {
          if (err) {
            this.logger.error("Error creating bucket with name: " + name);
          } else {
            this.logger.log("Created bucket with name: " + name);
            this.minioClient.setBucketVersioning(name, versioningStateConfig, (error) => {
              if (error) {
                return this.logger.error("Error updating versioning for bucket with name: " + name, err);
              }
              this.logger.log("Updated versioning for bucket with name: " + name);
            })
          }
        })
      }
    })
  }
  onModuleInit(): void {
    this.initBucket(TRAINING_DATA_BUCKET);
    this.initBucket(MODEL_BUCKET);
    this.initBucket(MONGO_DB_BACKUP_BUCKET);
  }

  async putTrainingCompressedTrainingData(filePath: string, metaData: any) {
    return new Promise((resolve, reject) =>
      this.minioClient.fPutObject(
        TRAINING_DATA_BUCKET,
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

  async getModelFilesByFolderAndName(modelFolder: string, fileName: string) : Promise<ReadableStream> {
    return new Promise((resolve, reject) => {
      this.minioClient.getObject(MODEL_BUCKET, modelFolder + "/" + fileName, function (err, dataStream) {
        if (err) {
          reject(err);
        }
        resolve(dataStream);
      })
    })
  }

  async getAllModelsAvailableToDownload(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      var data = []
      var stream = this.minioClient.listObjects(MODEL_BUCKET, '', true)
      stream
        .on('data', obj => data.push(obj))
        .on('end', obj => resolve(data))
        .on('error', err => reject(err))
    });
  }
}




