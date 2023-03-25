import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "src/repository/jobMeta.model";
import { JobService } from "src/service/job.service";
import { JobRegistryService } from "src/service/jobRegistry.service";
import { CleanUpJob } from "./cleanUpJob";
import { JobConfiguration, JobDefinition } from "./job.interface";
import { JobEventPublisherService } from "./jobEventPublisher.service";

@Injectable()
export class CleanUpJobConfiguration extends JobConfiguration {
    private readonly logger = new Logger(CleanUpJobConfiguration.name);

    private static jobDefinition: JobDefinition = new JobDefinition(
        "CleanUpJob",
        "Deletes old Job runs from the mongodb",
        CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT
    )

    constructor(
        @InjectModel(JobMeta.name) jobMetaModel: Model<JobMetaDocument>,
        jobEventPublisherService: JobEventPublisherService,
        jobRegistryService: JobRegistryService,
        schedulerRegistry: SchedulerRegistry,
        jobService: JobService) {
        super(jobMetaModel, jobEventPublisherService, jobRegistryService, schedulerRegistry);
        this.job = new CleanUpJob(CleanUpJobConfiguration.jobDefinition, jobService)
    }

    getLogger(): Logger {
        return this.logger;
    }

}