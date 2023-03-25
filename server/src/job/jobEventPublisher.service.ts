import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "../repository/jobMeta.model";
import { JobRun, JobRunDocument } from "../repository/jobRun.model";


export class JobEventPublisher {

    private log: string = "\n"
    private currentRunId : string = null;
    private isTerminated: boolean = false;

    private constructor(private readonly jobId: string,
         private readonly jobMetaModel: Model<JobMetaDocument>,
          private readonly jobRunModel: Model<JobRunDocument>) {}

    static createJobEventPublisher(jobId: string, jobMetaModel: Model<JobMetaDocument>, jobRunModel: Model<JobRunDocument>): JobEventPublisher {
        return new JobEventPublisher(jobId, jobMetaModel, jobRunModel);
    }

    get getTerminated(): boolean {
        return this.isTerminated
    }

    async startJob() {
        const startTime = Date.now();
        
        await this.jobMetaModel.findByIdAndUpdate(this.jobId, {
            lastJobRun: startTime
        }).exec()

        const jobRun = new this.jobRunModel({
            jobId: this.jobId,
            status: "RUNNING",
            startTime: startTime,
            endTime: null,
            logs: this.log,
        })
        const currentRun = await jobRun.save();
        this.currentRunId = currentRun.id;
    }

    async skipped() {
        this.isTerminated = true;
        await this.jobRunModel.findByIdAndUpdate(this.currentRunId, {
            status: "SKIPPED",
            endTime: Date.now()
        }).exec()

    }

    async success() {
        this.isTerminated = true;
        await this.jobRunModel.findByIdAndUpdate(this.currentRunId, {
            status: "SUCCESS",
            endTime: Date.now()
        }).exec()
    }

    async failure() {
        this.isTerminated = true;
        await this.jobRunModel.findByIdAndUpdate(this.currentRunId, {
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
        this.jobRunModel.findByIdAndUpdate(this.currentRunId, {
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