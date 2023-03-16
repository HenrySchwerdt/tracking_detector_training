import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { JobMeta } from "./jobMeta.model";
import { JobRun } from "./jobRun.model";
import { Job } from "./jobs/job.interface";
import { JobEventPublisherService } from "./jobs/jobEventPublisher.service";
import { ModelTrainingJob, MODEL_TRAINING_CRON } from "./jobs/modelTraining.job";

@Injectable()
export class JobService {

    constructor(private readonly modelTrainingJob: ModelTrainingJob, private readonly jobEventPublisherService: JobEventPublisherService) {

    }

    @Cron(MODEL_TRAINING_CRON)
    handleModelTrainingJob() {
        this.triggerJob(this.modelTrainingJob)
    }


    private triggerJob(job: Job) : boolean {
        const publisher = this.jobEventPublisherService.create("someId");
        const result = job.execute(publisher);
        return result;
    }


    async findJobById(id: any) : Promise<JobMeta> {
        throw new Error("Method not implemented.");
    }
    async findAllRunsForJob(id: any) : Promise<JobRun[]> {
        throw new Error("Method not implemented.");
    }
    async findAllJobs() : Promise<JobMeta[]> {
        throw new Error("Method not implemented.");
    }
    async toggleJobById(id: any) : Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async triggerJobById(id: any) : Promise<boolean> {
        throw new Error("Method not implemented.");
    }


}