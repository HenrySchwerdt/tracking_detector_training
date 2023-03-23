import { Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobService } from "./job.service";
import { JobMeta } from "./jobMeta.model";
import { JobRun } from "./jobRun.model";
import { JobRunnerService } from "./jobRunner.service";

@ApiBearerAuth()
@ApiTags('jobs-API')
@Controller("tracking-detector/jobs")
export class JobController {

    constructor(private readonly jobService: JobService, private readonly jobRunnerService : JobRunnerService) {}

    @Get()
    @ApiOperation({summary: "Lists all Jobs in the jobMetaRepository",})
    @ApiResponse({
        type: [JobMeta],
    })
    getAllJobs() : Promise<JobMeta[]>  {
        return this.jobService.findAllJobs();
    }

    @Get(":id/runs")
    @ApiOperation({summary: "Lists all job runs for a given jobid.",})
    @ApiResponse({
        type: [JobRun],
    })
    getAllRunsForJob(@Param('id') id : string) : Promise<JobRun[]> {
        return this.jobService.findAllRunsForJob(id);
    }

    @Get(":id")
    @ApiOperation({summary: "Gets job by id",})
    @ApiResponse({
        type: JobMeta,
    })
    getJobById(@Param('id') id : string) : Promise<JobMeta> {
        return this.jobService.findJobById(id);
    }

    @Post(":id/trigger")
    @ApiOperation({summary: "Triggers a job to execute by name.",})
    triggerJob(@Param('id') id : string) {
        this.jobRunnerService.triggerJobByName(id);
    }

    @Patch(":id/toggle")
    @ApiOperation({summary: "Toogles the enabled of job by name.",})
    toggleJob(@Param('id') id : string) {
        this.jobService.toggleJobById(id)
    }


}