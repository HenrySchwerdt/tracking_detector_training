import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestDto } from '../dto/request.dto';
import { Request, RequestDocument } from '../repository/request.model';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
  ) { }

  async create(createRequestDto: RequestDto): Promise<Request> {
    const createdRequest = new this.requestModel({
      documentId: createRequestDto.documentId,
      documentLifecycle: createRequestDto.documentLifecycle,
      frameId: createRequestDto.frameId,
      frameType: createRequestDto.frameType,
      initiater: createRequestDto.initiater,
      method: createRequestDto.method,
      parentFrameId: createRequestDto.parentFrameId,
      requestId: createRequestDto.requestId,
      tabId: createRequestDto.tabId,
      timeStamp: createRequestDto.timeStamp,
      url: createRequestDto.url,
      requestHeaders: createRequestDto.requestHeaders,
      success: createRequestDto.success,
      label: createRequestDto.labels[0].isLabeled
    });
    return createdRequest.save();
  }

  async findAll(): Promise<Request[]> {
    return this.requestModel.find().exec();
  }

  findAllByCursor() {
    return this.requestModel.find().cursor();
  }

  async getCountOfRequestDocuments(): Promise<number> {
    return this.requestModel.find().count();
  }
}
