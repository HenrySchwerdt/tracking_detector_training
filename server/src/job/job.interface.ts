import { Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import mongoose, { Model } from "mongoose";
import { JobRegistryService } from "src/service/jobRegistry.service";
import { JobMeta, JobMetaDocument } from "../repository/jobMeta.model";
import { JobEventPublisher, JobEventPublisherService } from "./jobEventPublisher.service";

export interface JobInterface {
    execute(jobEventPublisher: JobEventPublisher): Promise<boolean>;
    getName(): string;
    getDescription(): string;
    getCronPattern(): string;

}


export abstract class Job implements JobInterface {


    constructor(private jobDefinition: JobDefinition) { }

    abstract execute(jobEventPublisher: JobEventPublisher): Promise<boolean>

    getName(): string {
        return this.jobDefinition.jobName;
    }
    getDescription(): string {
        return this.jobDefinition.jobDescription;
    }
    getCronPattern(): string {
        return this.jobDefinition.cronPattern;
    }


}

export abstract class JobConfiguration {

    protected job: Job;
    private jobId?: string;

    constructor(private jobMetaModel: Model<JobMetaDocument>,
          private jobEventPublisherService: JobEventPublisherService,
          private jobRegistryService: JobRegistryService,
          private schedulerRegistry: SchedulerRegistry) { }

    async start(): Promise<void> {
        const jobMeta = await this.jobMetaModel.findById(this.jobId).exec();
        if (!jobMeta.enabled) {
            this.getLogger().log("Job didn't get triggered because it was manually disabled.");
            return;
        }
        const publisher = this.jobEventPublisherService.create(this.jobId);
        this.getLogger().log("Started job: '" + this.job.getName() + "'.")
        await publisher.startJob()
        try {
            const result = await this.job.execute(publisher);
            if (publisher.getTerminated) {
                return;
            }
            if (result) {
                await publisher.success();
            } else {
                await publisher.failure();
            }
        } catch (e) {
            publisher.error("An error occured: ", e)
            this.getLogger().error("Error occured at job:'" + this.job.getName() + "': ", e);
            await publisher.failure();
        }

    }

    onModuleInit(): void {
        this.getLogger().log("Initialzing Job: " + this.job.getName())
        let result = this.jobMetaModel.findOne({ jobName: this.job.getName() }).exec()
        result.then((value) => {
            let jobModel = value
            let saved = new Promise<JobMeta>(resolve => resolve(jobModel));
            if (jobModel == null) {
                const model = new this.jobMetaModel({
                    _id: new mongoose.Types.ObjectId(),
                    jobName: this.job.getName(),
                    jobDescription: this.job.getDescription(),
                    lastJobRun: null,
                    cronPattern: this.job.getCronPattern(),
                    enabled: true
                })
                saved = model.save()

            }

            saved.then(savedValue => {
                this.jobId = savedValue.id;
                this.jobRegistryService.registerJob(this.jobId, this)
                const job = new CronJob(this.job.getCronPattern(), () => {
                    this.start()
                });
                
                this.schedulerRegistry.addCronJob(this.job.getName(), job);
                job.start();
                // If CronPatternChanges
                if (savedValue.cronPattern != this.job.getCronPattern()) {
                    this.jobMetaModel.updateOne({ _id: savedValue.id }, { cronPattern: this.job.getCronPattern() }).exec()
                }
            })
        })
        

    }

    abstract getLogger(): Logger;

}

export class JobDefinition {
    constructor(public jobName: string, public jobDescription: string, public cronPattern: string) { }
}