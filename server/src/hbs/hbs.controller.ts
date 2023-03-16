import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { JobService } from "src/jobs/job.service";



@Controller("trackingDetectorService")
export class HbsController {
    constructor(private readonly jobService: JobService) {}
    @Get()
    root(@Res() res: Response) {
        return res.render('index', {
            layout: 'main',
        })
    }

    @Get("status")
    status(@Res() res: Response) {
        return res.render('status', {
            layout: 'main',
            message: 'HelloWorld'
        })
    }

    @Get("models")
    models(@Res() res: Response) {
        return res.render('models', {
            layout: 'main',
            message: 'HelloWorld'
        })
    }

    @Get("job-overview")
    async jobOverview(@Res() res: Response) {

        const jobs = await this.jobService.findAllJobs();
        return res.render('job-overview', {
            
            layout: 'main',
            jobs: jobs
        })
    }
}