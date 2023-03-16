import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { JobMeta, JobMetaSchema } from "./jobMeta.model";
import { JobRun, JobRunSchema } from "./jobRun.model";
import { JobEventPublisherService } from "./jobs/jobEventPublisher.service";
import { ModelTrainingJob } from "./jobs/modelTraining.job";




@Module({
    imports: [
        MongooseModule.forFeature([{ name: JobMeta.name, schema: JobMetaSchema }]),
        MongooseModule.forFeature([{ name: JobRun.name, schema: JobRunSchema }])
    ],
    controllers: [JobController],
    providers: [JobService, JobEventPublisherService, ModelTrainingJob],
})
export class JobModule { }