import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Model } from "mongoose";
import { ExtractorUtils } from "src/extractor/extractorUtils";
import { FeatureExtractor } from "src/extractor/featureExtractor";
import { JobMeta, JobMetaDocument } from "src/repository/jobMeta.model";
import { JobRegistryService } from "src/service/jobRegistry.service";
import { MinioService } from "src/service/minio.service";
import { RequestsService } from "src/service/requests.service";
import { JobConfiguration, JobDefinition } from "./job.interface";
import { JobEventPublisherService } from "./jobEventPublisher.service";
import { RequestDataExportJob } from "./requestDataExportJob";

@Injectable()
export class RequestDataExport204JobConfiguration extends JobConfiguration {
    private readonly logger = new Logger(RequestDataExport204JobConfiguration.name);

    private static readonly extractor = FeatureExtractor.builder(204)
                                    .withUrlExtractor(ExtractorUtils.URL_EXTRACTOR)
                                    .withFrameTypeExtractor(ExtractorUtils.FRAME_TYPE_EXTRACTOR)
                                    .withMethodExtractor(ExtractorUtils.METHOD_EXTRACTOR)
                                    .withTypeExtractor(ExtractorUtils.TYPE_EXTRACTOR)
                                    .withRequestHeadersExtractor(ExtractorUtils.HEADER_REFERRER_EXTRACTOR)
                                    .build()

    private static jobDefinition: JobDefinition = new JobDefinition(
        "RequestDataExport204Job",
        "Exports the requests data into a csv with a feature vector of size [204, 1].",
        CronExpression.EVERY_WEEK
    )
    
    constructor(@InjectModel(JobMeta.name) jobMetaModel: Model<JobMetaDocument>,
     jobEventPublisherService: JobEventPublisherService,
     jobRegistryService: JobRegistryService,
     schedulerRegistry: SchedulerRegistry,
     requestService: RequestsService,
     minioService: MinioService) {
        super(jobMetaModel, jobEventPublisherService, jobRegistryService, schedulerRegistry)
        this.job = new RequestDataExportJob(
            RequestDataExport204JobConfiguration.jobDefinition,
            RequestDataExport204JobConfiguration.extractor,
            requestService,
            minioService
        )
    }
    
    
    getLogger(): Logger {
        return this.logger;
    }

}