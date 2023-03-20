import mongoose, { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "../jobMeta.model";
import { JobEventPublisher, JobEventPublisherService } from "./jobEventPublisher.service";

export interface JobInterface {
    execute(jobEventPublisher: JobEventPublisher): Promise<boolean>;
    getName(): string;
    getDescription(): string;
    getCronPattern(): string;

    onModuleInit(): void;

}

export abstract class Job implements JobInterface {

    private jobId? : string;

    constructor(private jobMetaModel: Model<JobMetaDocument>, private jobEventPublisherService: JobEventPublisherService) {}

    abstract execute(jobEventPublisher: JobEventPublisher): Promise<boolean>
    abstract getName(): string
    abstract getDescription(): string
    abstract getCronPattern(): string

    async start() : Promise<void> {
        const jobMeta = await this.jobMetaModel.findById(this.jobId);
        if (!jobMeta.enabled) {
            return;
        }
        const publisher = this.jobEventPublisherService.create(this.jobId);
        await publisher.startJob()
        try {
            const result = await this.execute(publisher);
            if (publisher.getTerminated) {
                return;
            }
            if (result) {
                await publisher.success();
            } else {
                await publisher.failure();
            }
        } catch(e) {
            publisher.error("An error occured: ", e)
        }
        
    }

    onModuleInit(): void {
        console.log("Initialzing Job: " + this.getName())
        let result = this.jobMetaModel.findOne({jobName: this.getName()}).exec()
        result.then((value) => {
            let jobModel = value
            let saved = new Promise<JobMeta>(resolve => resolve(jobModel));
            if (jobModel == null) {
                const model = new this.jobMetaModel({
                    _id: new mongoose.Types.ObjectId(),
                    jobName: this.getName(),
                    jobDescription: this.getDescription(),
                    lastJobRun: null,
                    cronPattern: this.getCronPattern(),
                    enabled: true
                })
                saved = model.save()
                
            }
           
            saved.then(savedValue => {
                this.jobId = savedValue.id;
                // If CronPatternChanges
                if (savedValue.cronPattern != this.getCronPattern()) {
                    this.jobMetaModel.updateOne({ _id: savedValue.id }, { cronPattern: this.getCronPattern() }).exec()
                }
            })
        })

    }


}