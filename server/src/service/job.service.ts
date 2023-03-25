import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { JobMeta, JobMetaDocument } from '../repository/jobMeta.model';
import { JobRun, JobRunDocument } from '../repository/jobRun.model';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(JobMeta.name) private jobMetaModel: Model<JobMetaDocument>,
    @InjectModel(JobRun.name) private jobRunModel: Model<JobRunDocument>,
  ) {}

  async findJobById(id: string): Promise<JobMeta> {
    return this.jobMetaModel.findById(id).exec();
  }
  async findAllRunsForJob(id: string): Promise<JobRun[]> {
    return this.jobRunModel.find({ jobId: id }).exec();
  }
  async findAllJobs(): Promise<JobMeta[]> {
    return this.jobMetaModel.find().exec();
  }
  async findRunById(id: string): Promise<JobRun> {
    return this.jobRunModel.findById(id);
  }

  async findAllJobRuns(): Promise<JobRun[]> {
    return this.jobRunModel.find();
  }

  async deleteJobRunById(id: string) {
    this.jobRunModel.deleteOne({ _id: id });
  }

  async toggleJobById(id: string): Promise<boolean> {
    const job = await this.jobMetaModel.findById(id);

    await this.jobMetaModel.updateOne(
      { _id: job.id },
      {
        enabled: !job.enabled,
      },
    );
    return true;
  }
}
