import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { randomUUID } from "crypto";
import mongoose, { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "./jobMeta.model";
import { JobRun, JobRunDocument } from "./jobRun.model";
import { Job } from "./jobs/job.interface";
import { JobEventPublisherService } from "./jobs/jobEventPublisher.service";
import { ModelTrainingJob, MODEL_TRAINING_CRON } from "./jobs/modelTraining.job";

@Injectable()
export class JobRunnerService {

    constructor(private readonly modelTrainingJob: ModelTrainingJob,
        private readonly jobEventPublisherService: JobEventPublisherService,
        @InjectModel(JobMeta.name) private jobMetaModel: Model<JobMetaDocument>) {

    }

    @Cron(MODEL_TRAINING_CRON)
    handleModelTrainingJob() {
        this.triggerJob(this.modelTrainingJob)
    }

    private async checkJobMetaRepository(job: Job): Promise<JobMeta> {
        let result = await this.jobMetaModel.findOne({name: job.getName()}).exec()
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
        return result;
    }

    private async triggerJob(job: Job) : Promise<boolean> {
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