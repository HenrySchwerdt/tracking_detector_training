import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JobService } from 'src/jobs/job.service';

@Controller('tracking-detector')
@ApiTags('ui')
@ApiBearerAuth()
export class HbsController {
  constructor(private readonly jobService: JobService) {}
  @Get()
  @ApiOperation({summary: "Returns the root admin page",})
  root(@Res() res: Response) {
    return res.render('index', {
      layout: 'main',
    });
  }

  @Get('status')
  @ApiOperation({summary: "Returns the status admin page",})
  status(@Res() res: Response) {
    return res.render('status', {
      layout: 'main',
      message: 'HelloWorld',
    });
  }

  @Get('models')
  @ApiOperation({summary: "Returns the models admin page",})
  models(@Res() res: Response) {
    return res.render('models', {
      layout: 'main',
      message: 'HelloWorld',
    });
  }

  @Get('job-overview')
  @ApiOperation({summary: "Returns the job-overview admin page",})
  async jobOverview(@Res() res: Response) {
    const jobs = await this.jobService.findAllJobs();
    return res.render('job-overview', {
      layout: 'main',
      jobs: jobs,
    });
  }

  @Get('job-runs/:id')
  @ApiOperation({summary: "Returns the job runs for specific job admin page",})
  async jobRuns(@Param() params, @Res() res: Response) {
    const jobRuns = await this.jobService.findAllRunsForJob(params.id);
    return res.render('job-runs', {
      layout: 'main',
      jobRuns: jobRuns.sort((run1, run2) => run2.startTime - run1.startTime),
    });
  }

  @Get('job-runs/:jobId/:runId/logs')
  @ApiOperation({summary: "Returns the the logs of a specific job run admin page",})
  async jobLogs(@Param() params, @Res() res: Response) {
    const jobRun = await this.jobService.findRunById(params.runId);
    return res.render('job-logs', {
      layout: 'main',
      jobRun: jobRun,
    });
  }

  @Get('swagger')
  @ApiOperation({summary: "Returns the swagger documentation",}) 
  getSwaggerUi(@Res() res: Response) {
    return res.render('swagger', {
      layout: 'main'
    });
  }
}
