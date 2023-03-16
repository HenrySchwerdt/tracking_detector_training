import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "../jobMeta.model";
import { JobRun, JobRunDocument } from "../jobRun.model";


export class JobEventPublisher {

    private log: string = ""

    private constructor(private readonly jobId: string,
         private readonly jobMetaModel: Model<JobMetaDocument>,
          private readonly jobRunModel: Model<JobRunDocument>) {}

    static createJobEventPublisher(jobId: string, jobMetaModel: Model<JobMetaDocument>, jobRunModel: Model<JobRunDocument>): JobEventPublisher {
        return new JobEventPublisher(jobId, jobMetaModel, jobRunModel);
    }

    async startJob() {
        const startTime = Date.now();
        await this.jobMetaModel.updateOne({_id: this.jobId}, {
            lastJobRun: startTime
        }).exec()

        const jobRun = new this.jobRunModel({
            id: this.jobId,
            status: "RUNNING",
            startTime: startTime,
            endTime: null,
            logs: this.log,
        })
        await jobRun.save();
    }

    async skipped() {
        await this.jobRunModel.updateOne({_id: this.jobId}, {
            status: "SKIPPED",
            endTime: Date.now()
        }).exec()
    }

    async success() {
        await this.jobRunModel.updateOne({_id: this.jobId}, {
            status: "SUCCESS",
            endTime: Date.now()
        }).exec()
    }

    async failure() {
        await this.jobRunModel.updateOne({_id: this.jobId}, {
            status: "FAILURE",
            endTime: Date.now()
        }).exec()
    }

    info(...message : string[]) {
        this.generateLogLine("Info", message)
    }

    warn(...message : string[]) {
        this.generateLogLine("Warn", message)
    }

    error(...message : string[]) {
        this.generateLogLine("Error", message)
    }

    private generateLogLine(level: string, messages: string[]) {
        this.log += (new Date(Date.now()).toISOString()) 
        + " : " 
        + level
        + " : "
        + messages.join(" ")
        + "\n";
        this.jobRunModel.updateOne({_id: this.jobId}, {
            logs: this.log
        }).exec()
    }
}


@Injectable()
export class JobEventPublisherService {
    constructor(@InjectModel(JobMeta.name) private jobMetaModel: Model<JobMetaDocument>,
    @InjectModel(JobRun.name) private jobRunModel: Model<JobRunDocument>,) {}

    create(jobId: string) : JobEventPublisher {
        return JobEventPublisher.createJobEventPublisher(jobId, this.jobMetaModel, this.jobRunModel);
    } 
}