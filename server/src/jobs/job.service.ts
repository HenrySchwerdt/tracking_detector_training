import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "./jobMeta.model";
import { JobRun, JobRunDocument } from "./jobRun.model";

@Injectable()
export class JobService {

    constructor(@InjectModel(JobMeta.name) private jobMetaModel: Model<JobMetaDocument>,
        @InjectModel(JobRun.name) private jobRunModel: Model<JobRunDocument>) {

    }

    async findJobById(id: string) : Promise<JobMeta> {
        return this.jobMetaModel.findById(id).exec()
    }
    async findAllRunsForJob(id: string) : Promise<JobRun[]> {
        return this.jobRunModel.find({jobId: id}).exec()
    }
    async findAllJobs() : Promise<JobMeta[]> {
        return this.jobMetaModel.find().exec();
    }
    async findRunById(id: string) : Promise<JobRun> {
        return this.jobRunModel.findById(id);
    }
    async toggleJobById(id: string) : Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async triggerJobById(id: string) : Promise<boolean> {
        throw new Error("Method not implemented.");
    }


}