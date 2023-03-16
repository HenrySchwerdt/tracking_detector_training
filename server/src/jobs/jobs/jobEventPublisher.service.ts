import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "../jobMeta.model";
import { JobRun, JobRunDocument } from "../jobRun.model";


export class JobEventPublisher {
    private constructor(private readonly jobId: string,
         private readonly jobMetaModel: Model<JobMetaDocument>,
          private readonly jobRunModel: Model<JobRunDocument>) {}

    static createJobEventPublisher(jobId: string, jobMetaModel: Model<JobMetaDocument>, jobRunModel: Model<JobRunDocument>): JobEventPublisher {
        return new JobEventPublisher(jobId, jobMetaModel, jobRunModel);
    }

    startJob() {

    }

    skipped() {

    }

    success() {

    }

    failure() {

    }

    info() {

    }

    warn() {

    }

    error() {

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