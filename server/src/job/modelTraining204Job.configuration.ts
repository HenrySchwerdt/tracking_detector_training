import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "src/repository/jobMeta.model";
import { JobRegistryService } from "src/service/jobRegistry.service";
import { JobConfiguration, JobDefinition } from "./job.interface";
import { JobEventPublisherService } from "./jobEventPublisher.service";
import { ModelTrainingJob } from "./modelTraining.job";

@Injectable()
export class ModelTraining204JobConfiguration extends JobConfiguration {
    private readonly logger = new Logger(ModelTraining204JobConfiguration.name);

    private static jobDefinition: JobDefinition = new JobDefinition(
        "ModelTraining204Job",
        "Trains models given the the vector input of [204, 1].",
        CronExpression.EVERY_WEEK
    )

    constructor(@InjectModel(JobMeta.name) jobMetaModel: Model<JobMetaDocument>,
    jobEventPublisherService: JobEventPublisherService,
    jobRegistryService: JobRegistryService,
    schedulerRegistry: SchedulerRegistry,
    ) {
        super(jobMetaModel, jobEventPublisherService, jobRegistryService, schedulerRegistry);
        this.job = new ModelTrainingJob(ModelTraining204JobConfiguration.jobDefinition)
    }
    
    getLogger(): Logger {
        return this.logger;
    }
    
}