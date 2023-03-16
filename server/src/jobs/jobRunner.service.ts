import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import mongoose, { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "./jobMeta.model";
import { CleanUpJob, CLEAN_UP_JOB_CRON } from "./jobDefinitions/cleanUpJob";
import { Job } from "./jobDefinitions/job.interface";
import { JobEventPublisherService } from "./jobDefinitions/jobEventPublisher.service";
import { ModelTrainingJob, MODEL_TRAINING_JOB_CRON } from "./jobDefinitions/modelTraining.job";

@Injectable()
export class JobRunnerService {

    constructor(private readonly modelTrainingJob: ModelTrainingJob,
        private readonly cleanUpJob: CleanUpJob,
        private readonly jobEventPublisherService: JobEventPublisherService,
        @InjectModel(JobMeta.name) private jobMetaModel: Model<JobMetaDocument>) {}
   

    @Cron(MODEL_TRAINING_JOB_CRON)
    handleModelTrainingJob() {
        this.triggerJob(this.modelTrainingJob);
    }

    @Cron(CLEAN_UP_JOB_CRON)
    handleCleanUpJob() {
        this.triggerJob(this.cleanUpJob);
    }

    private async checkJobMetaRepository(job: Job): Promise<JobMeta> {
        let result = await this.jobMetaModel.findOne({ name: job.getName() }).exec()
        if (result == null) {
            const model = new this.jobMetaModel({
                _id: new mongoose.Types.ObjectId(),
                jobName: job.getName(),
                jobDescription: job.getDescription(),
                lastJobRun: null,
                cronPattern: job.getCronPattern(),
                enabled: true
            })
            result = await model.save()
        }
        // If CronPatternChanges
        if (result.cronPattern != job.getCronPattern()) {
            await this.jobMetaModel.updateOne({ _id: result.id }, { cronPattern: job.getCronPattern() }).exec()
            result = await this.jobMetaModel.findOne({ name: job.getName() }).exec()
        }
        return result;
    }

    private async triggerJob(job: Job): Promise<boolean> {
        const jobMeta = await this.checkJobMetaRepository(job);
        if (!jobMeta.enabled) {
            return false;
        }
        const publisher = this.jobEventPublisherService.create(jobMeta.id);
        await publisher.startJob()
        const result = await job.execute(publisher);
        if (result) {
            await publisher.success();
        } else {
            await publisher.failure();
        }
        return result;
    }


}