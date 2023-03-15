import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { Request, RequestSchema } from "./request.model";
import { RequestsController } from "./requests.controller";
import { RequestsService } from "./requests.service";



@Module({
    imports: [MongooseModule.forFeature([{name: Request.name, schema: RequestSchema}])],
    controllers: [RequestsController],
    providers: [RequestsService],
})
export class RequestModule {}