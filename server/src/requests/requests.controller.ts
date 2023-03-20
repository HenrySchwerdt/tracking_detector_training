import { Body, Controller, Get, Post } from "@nestjs/common";
import { RequestDto } from "./request.dto";
import { Request } from "./request.model";
import { RequestsService } from "./requests.service";

@Controller('tracking-detector/requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}


    @Post()
    async createRequest(
        @Body() requestDto: RequestDto
    ) {
        await this.requestsService.create(requestDto);
    }


    @Get()
    async findAll(): Promise<Request[]> {
        return this.requestsService.findAll();
    }

}