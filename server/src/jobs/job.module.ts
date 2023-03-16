import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JobController } from "./job.controller";
import { JobRunnerService } from "./jobRunner.service";
import { JobMeta, JobMetaSchema } from "./jobMeta.model";
import { JobRun, JobRunSchema } from "./jobRun.model";
import { JobEventPublisherService } from "./jobDefinitions/jobEventPublisher.service";
import { ModelTrainingJob } from "./jobDefinitions/modelTraining.job";
import { JobService } from "./job.service";
import { CleanUpJob } from "./jobDefinitions/cleanUpJob";
import { RequestDataExportJob } from "./jobDefinitions/requestDataExportJob";
import { RequestSchema, Request } from "src/requests/request.model";
import { RequestsService } from "src/requests/requests.service";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: JobMeta.name, schema: JobMetaSchema }]),
        MongooseModule.forFeature([{ name: JobRun.name, schema: JobRunSchema }]),
        MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }])
    ],
    controllers: [JobController],
    providers: [
        JobService,
        JobEventPublisherService,
        ModelTrainingJob, 
        CleanUpJob, 
        RequestDataExportJob, 
        JobRunnerService, 
        RequestsService
    ],
})
export class JobModule { }