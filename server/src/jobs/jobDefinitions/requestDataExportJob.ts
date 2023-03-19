import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { RequestsService } from 'src/requests/requests.service';
import { JobMeta, JobMetaDocument } from '../jobMeta.model';
import { Job } from './job.interface';
import { JobEventPublisher } from './jobEventPublisher.service';

export const REQUEST_DATA_EXPORT_JOB_CRON = CronExpression.EVERY_WEEK;

@Injectable()
export class RequestDataExportJob extends Job {
  constructor(
    private readonly requestsService: RequestsService,
    @InjectModel(JobMeta.name) jobMetaModel: Model<JobMetaDocument>,
  ) {
    super(jobMetaModel);
  }

  async execute(jobEventPublisher: JobEventPublisher): Promise<boolean> {
    jobEventPublisher.info('Starting Export...');
    return true;
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
