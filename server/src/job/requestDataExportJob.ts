import {
  appendFileSync,
  createReadStream,
  createWriteStream,
  unlinkSync,
} from 'fs';
import { Request } from 'src/repository/request.model';
import { Job, JobDefinition } from './job.interface';
import { JobEventPublisher } from './jobEventPublisher.service';
import { createGzip } from 'zlib';
import { MinioService } from 'src/service/minio.service';
import { RequestsService } from 'src/service/requests.service';

export class RequestDataExportJob extends Job {
  constructor(
    jobDefinition: JobDefinition,
    private featureExtractor: (request: Request) => string,
    private readonly requestsService: RequestsService,
    private readonly minioService: MinioService,
  ) {
    super(jobDefinition);
  }

  async execute(jobEventPublisher: JobEventPublisher): Promise<boolean> {
    jobEventPublisher.info('Starting Export...');
    const numberOfRequests =
      await this.requestsService.getCountOfRequestDocuments();

    if (numberOfRequests == 0) {
      jobEventPublisher.warn(
        'Did not find any request data in the database...',
      );
      jobEventPublisher.skipped();
      return false;
    }

    jobEventPublisher.info(
      'Found ' + numberOfRequests,
      ' RequestObjects in Database...',
    );
    const unZippedFileName = 'temp.csv';

    let progress = 0;
    const cursor = this.requestsService.findAllByCursor();

    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      if (progress % 1000 == 0) {
        jobEventPublisher.info('Progress: ' + progress, '/' + numberOfRequests);
      }
      appendFileSync(unZippedFileName, this.featureExtractor(doc));
      progress++;
    }

    jobEventPublisher.info('Finished export to temp File for compression...');
    const zippedFileName = 'training.csv.gz';
    const error = await this.compressFile(unZippedFileName, zippedFileName);
    jobEventPublisher.info(JSON.stringify(error));
    jobEventPublisher.info('Finished compression...');
    await this.minioService.putTrainingCompressedTrainingData(
      zippedFileName,
      {},
    );
    unlinkSync(unZippedFileName);
    jobEventPublisher.info("Deleted '", unZippedFileName, "' from disk...");
    unlinkSync(zippedFileName);
    jobEventPublisher.info("Deleted '", zippedFileName, "' from disk...");

    return true;
  }

  private async compressFile(src: string, dest: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const gzip = createGzip();
      const input = createReadStream(src);
      const out = createWriteStream(dest);
      input.pipe(gzip).pipe(out).on('finish', resolve).on('error', reject);
    });
  }
}
