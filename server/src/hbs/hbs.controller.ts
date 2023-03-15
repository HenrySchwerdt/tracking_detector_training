import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";


@Controller()
export class HbsController {
    @Get("status")
    root(@Res() res: Response) {
        return res.render('status', {
            layout: 'main',
            message: 'HelloWorld'
        })
    }
}