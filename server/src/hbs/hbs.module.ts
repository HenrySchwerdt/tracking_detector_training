import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JobService } from "src/jobs/job.service";
import { JobMeta, JobMetaSchema } from "src/jobs/jobMeta.model";
import { JobRun, JobRunSchema } from "src/jobs/jobRun.model";
import { HbsController } from "./hbs.controller";
import { HbsService } from "./hbs.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: JobMeta.name, schema: JobMetaSchema }]),
    MongooseModule.forFeature([{ name: JobRun.name, schema: JobRunSchema }])],
    controllers: [HbsController],
    providers: [HbsService, JobService]
})
export class HbsModule {}