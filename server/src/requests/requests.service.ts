import { Controller, Injectable, Post } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestDto } from "./request.dto";
import { Request, RequestDocument } from "./request.model";

@Injectable()
export class RequestsService {
    constructor(@InjectModel(Request.name) private requestModel: Model<RequestDocument>) {}


    async create(createRequestDto: RequestDto): Promise<Request> {
        const createdRequest = new this.requestModel(createRequestDto);
        return createdRequest.save();
    }


    async findAll(): Promise<Request[]> {
        return this.requestModel.find().exec();
    }
}