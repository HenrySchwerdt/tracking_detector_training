import mongoose, { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "../jobMeta.model";
import { JobEventPublisher } from "./jobEventPublisher.service";

export interface JobInterface {
    execute(jobEventPublisher: JobEventPublisher): Promise<boolean>;
    getName(): string;
    getDescription(): string;
    getCronPattern(): string;

    onModuleInit(): void;

}

export abstract class Job implements JobInterface {

    constructor(private jobMetaModel: Model<JobMetaDocument>) {}

    abstract execute(jobEventPublisher: JobEventPublisher): Promise<boolean>
    abstract getName(): string
    abstract getDescription(): string
    abstract getCronPattern(): string

    onModuleInit(): void {
        console.log("Initialzing Job: " + this.getName())
        let result = this.jobMetaModel.find().exec()
        result.then((value) => {
            let jobModel = value.find(job => job.jobName == this.getName())
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
                // If CronPatternChanges
                if (savedValue.cronPattern != this.getCronPattern()) {
                    this.jobMetaModel.updateOne({ _id: savedValue.id }, { cronPattern: this.getCronPattern() }).exec()
                }
            })
        })

    }


}