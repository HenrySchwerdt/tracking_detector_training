import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { JobService } from 'src/jobs/job.service';

@Controller('tracking-detector')
export class HbsController {
  constructor(private readonly jobService: JobService) {}
  @Get()
  root(@Res() res: Response) {
    return res.render('index', {
      layout: 'main',
    });
  }

  @Get('status')
  status(@Res() res: Response) {
    return res.render('status', {
      layout: 'main',
      message: 'HelloWorld',
    });
  }

  @Get('models')
  models(@Res() res: Response) {
    return res.render('models', {
      layout: 'main',
      message: 'HelloWorld',
    });
  }

  @Get('job-overview')
  async jobOverview(@Res() res: Response) {
    const jobs = await this.jobService.findAllJobs();
    return res.render('job-overview', {
      layout: 'main',
      jobs: jobs,
    });
  }

  @Get('job-runs/:id')
  async jobRuns(@Param() params, @Res() res: Response) {
    const jobRuns = await this.jobService.findAllRunsForJob(params.id);
    return res.render('job-runs', {
      layout: 'main',
      jobRuns: jobRuns.sort((run1, run2) => run2.startTime - run1.startTime),
    });
  }

  @Get('job-runs/:jobId/:runId/logs')
  async jobLogs(@Param() params, @Res() res: Response) {
    const jobRun = await this.jobService.findRunById(params.runId);
    return res.render('job-logs', {
      layout: 'main',
      jobRun: jobRun,
    });
  }

  @Get('swagger') 
  getSwaggerUi(@Res() res: Response) {
    return res.render('swagger', {
      layout: 'main'
    });
  }
}
