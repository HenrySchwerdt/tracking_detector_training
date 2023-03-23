import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequestDto } from "./request.dto";
import { Request } from "./request.model";
import { RequestsService } from "./requests.service";

@ApiBearerAuth()
@ApiTags('requests')
@Controller('tracking-detector/requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}


    @Post()
    @ApiOperation({summary: "Creates new requests object in the mongodb.",})
    @ApiResponse({})
    async createRequest(
        @Body() requestDto: RequestDto
    ) {
        await this.requestsService.create(requestDto);
    }


    @Get()
    @ApiOperation({summary: "Creates new requests object in the mongodb.",})
    @ApiResponse({
        status: 200,
        description: "Lists all requests in db.",
        type: [Request],
    })
    async findAll(): Promise<Request[]> {
        return this.requestsService.findAll();
    }

}