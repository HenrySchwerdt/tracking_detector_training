import { Injectable } from "@nestjs/common";
import { JobConfiguration } from "src/job/job.interface";

@Injectable()
export class JobRegistryService {
    private registry = {}

    registerJob(jobId: string, config: JobConfiguration): void {
        this.registry[jobId] = config;
    }

    getRunnableForJobId(jobId: string): JobConfiguration {
        return this.registry[jobId];
    }
}