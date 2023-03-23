import { Controller, Get, Param } from "@nestjs/common";

@Controller('tracking-detector/models')
export class ModelsController {


    @Get(":modelId/:resource")
    getModelData(@Param() params) {

    }
}