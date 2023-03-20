import { Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { JobService } from "./job.service";
import { JobMeta } from "./jobMeta.model";
import { JobRun } from "./jobRun.model";
import { JobRunnerService } from "./jobRunner.service";

@Controller("tracking-detector/jobs")
export class JobController {

    constructor(private readonly jobService: JobService, private readonly jobRunnerService : JobRunnerService) {}

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

    @Post("trigger/:jobName")
    triggerJob(@Param() params) {
        this.jobRunnerService.triggerJobByName(params.jobName);
    }

    @Patch("toggle/:jobName")
    toggleJob(@Param() params) {
        this.jobService.toggleJobById(params.jobName)
    }


}