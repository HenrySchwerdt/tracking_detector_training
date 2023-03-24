import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CronExpression } from '@nestjs/schedule';
import { appendFileSync, createReadStream, createWriteStream, unlinkSync } from 'fs';
import { Model } from 'mongoose';
import { Request } from 'src/requests/request.model';
import { RequestsService } from 'src/requests/requests.service';
import { JobMeta, JobMetaDocument } from '../jobMeta.model';
import { Job } from './job.interface';
import { JobEventPublisher, JobEventPublisherService } from './jobEventPublisher.service';
import { createGzip } from 'zlib';
import { MinioService } from 'src/minio/minio.service';


export const REQUEST_DATA_EXPORT_JOB_CRON = CronExpression.EVERY_WEEK;


const methods = [
  "GET",
  "POST",
  "OPTIONS",
  "HEAD",
  "PUT",
  "DELETE",
  "SEARCH",
  "PATCH",
];

const types = [
  "xmlhttprequest",
  "image",
  "font",
  "script",
  "stylesheet",
  "ping",
  "sub_frame",
  "other",
  "main_frame",
  "csp_report",
  "object",
  "media",
];

const frameTypes = ["outermost_frame", "fenced_frame", "sub_frame"];

@Injectable()
export class RequestDataExportJob104 extends Job {

  constructor(
    private readonly requestsService: RequestsService,
    private readonly minioService: MinioService,
    @InjectModel(JobMeta.name) jobMetaModel: Model<JobMetaDocument>,
    jobEventPublisherService: JobEventPublisherService
  ) {
    super(jobMetaModel, jobEventPublisherService);
  }

  async execute(jobEventPublisher: JobEventPublisher): Promise<boolean> {
    jobEventPublisher.info('Starting Export...');
    const numberOfRequests = await this.requestsService.getCountOfRequestDocuments();

    if (numberOfRequests == 0) {
      jobEventPublisher.warn("Did not find any request data in the database...");
      jobEventPublisher.skipped();
      return false;
    }

    jobEventPublisher.info('Found ' + numberOfRequests, ' RequestObjects in Database...');
    const unZippedFileName = "temp.csv"

    let progress = 0;
    var cursor = this.requestsService.findAllByCursor();

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      if (progress % 1000 == 0) {
        jobEventPublisher.info('Progress: ' + progress, '/' + numberOfRequests);
      }
      appendFileSync(unZippedFileName, this.createFeatureString(doc))
      progress++;
    }

    jobEventPublisher.info("Finished export to temp File for compression...");
    const zippedFileName = 'training.csv.gz';
    const error = await this.compressFile(unZippedFileName, zippedFileName);
    jobEventPublisher.info(JSON.stringify(error))
    jobEventPublisher.info("Finished compression...")
    await this.minioService.putTrainingCompressedTrainingData(zippedFileName, {});
    unlinkSync(unZippedFileName);
    jobEventPublisher.info("Deleted '", unZippedFileName, "' from disk...")
    unlinkSync(zippedFileName);
    jobEventPublisher.info("Deleted '", zippedFileName, "' from disk...")

    return true;
  }

  private async compressFile(src: string, dest: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      const gzip = createGzip();
      var input = createReadStream(src);
      var out = createWriteStream(dest);
      input.pipe(gzip)
      .pipe(out)
      .on('finish', resolve)
      .on('error', reject)
      
    })
  }

  private createFeatureString(request: Request) {
    let features = [];
    features = features.concat(this.generateURLEncoding(request.url));
    // features.push(request.frameId > 200000 ? 199999 : (request.frameId+1));
    features.push(frameTypes.indexOf(request.frameType) + 1);
    features.push(methods.indexOf(request.method) + 1);
    features.push(types.indexOf(request.type) + 1);
    features.push(
      request.requestHeaders.filter((x) => x.name == "Referer").length == 1
        ? 1
        : 0
    );
    features.push(request.label ? 1 : 0);
    return features.join(",") + "\n";
  }

  private generateURLEncoding(url: string) {
    let encoding = [];
    for (let i = 0; i < url.length; i++) {
      encoding.push((url.charCodeAt(i) % 89) + 1);
    }
    if (encoding.length < 200) {
      encoding = new Array(200 - encoding.length).fill(0).concat(encoding);
    } else if (encoding.length > 200) {
      encoding.splice(0, encoding.length - 200);
    }
    return encoding;
  }

  getName(): string {
    return 'RequestDataExportJob';
  }
  getDescription(): string {
    return 'Job which exports MongoDb Data in MinioBucket in a CSV Format';
  }
  getCronPattern(): string {
    return REQUEST_DATA_EXPORT_JOB_CRON;
  }
}
