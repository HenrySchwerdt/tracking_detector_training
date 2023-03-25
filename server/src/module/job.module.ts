import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from '../controller/job.controller';
import { JobRunnerService } from '../service/jobRunner.service';
import { JobMeta, JobMetaSchema } from '../repository/jobMeta.model';
import { JobRun, JobRunSchema } from '../repository/jobRun.model';
import { JobService } from '../service/job.service';
import { CleanUpJob } from '../job/cleanUpJob';
import { JobEventPublisherService } from 'src/job/jobEventPublisher.service';
import { ModelTrainingJob } from 'src/job/modelTraining.job';
import { RequestsService } from 'src/service/requests.service';
import { MinioModule } from './minio.module';
import { RequestsModule } from './requests.module';
import { RequestDataExportJob } from 'src/job/requestDataExportJob';
import { JobRegistryService } from 'src/service/jobRegistry.service';
import { ModelTraining204JobConfiguration } from 'src/job/modelTraining204Job.configuration';
import { RequestDataExport204JobConfiguration } from 'src/job/requestDataExport204Job.configuration';
import { CleanUpJobConfiguration } from 'src/job/cleanUpJob.configuration';


@Module({
  imports: [
    RequestsModule,
    MinioModule,
    MongooseModule.forFeature([{ name: JobMeta.name, schema: JobMetaSchema }]),
    MongooseModule.forFeature([{ name: JobRun.name, schema: JobRunSchema }]),
  ],
  controllers: [JobController],
  providers: [
    JobRegistryService,
    JobService,
    JobEventPublisherService,
    ModelTraining204JobConfiguration,
    RequestDataExport204JobConfiguration,
    CleanUpJobConfiguration,
    JobRunnerService,
    RequestsService,
  ],
  exports: [JobService, ],
})
export class JobModule {}
