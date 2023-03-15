import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";


@Controller("trackingDetectorService")
export class HbsController {

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
    jobOverview(@Res() res: Response) {
        return res.render('job-overview', {
            layout: 'main',
            message: 'HelloWorld'
        })
    }
}