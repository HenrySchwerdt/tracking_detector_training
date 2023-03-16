import { Controller, Get, Param, Post } from "@nestjs/common";
import { JobService } from "./job.service";
import { JobMeta } from "./jobMeta.model";
import { JobRun } from "./jobRun.model";

@Controller("jobs")
export class JobController {

    constructor(private readonly jobService: JobService) {}

    @Post(":id")
    triggerJob(@Param() params) : Object {
        const triggerResult = this.jobService.triggerJobById(params.id);
        return {
            triggerResult 
        }

    }

    @Post(":id/toggle")
    toggleJob(@Param() params) : Object {
        const enabled = this.jobService.toggleJobById(params.id);
        return {
            enabled
        }
    }

    @Get()
    getAllJobs() : Promise<JobMeta[]>  {
        return this.jobService.findAllJobs();
    }

    @Get("runs/:id")
    getAllRunsForJob(@Param() params) : Promise<JobRun[]> {
        return this.jobService.findAllRunsForJob(params.id);
    }

    @Get(":id")
    getJobById(@Param() params) : Promise<JobMeta> {
        return this.jobService.findJobById(params.id);
    }


}