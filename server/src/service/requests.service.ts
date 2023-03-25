import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cursor, Model, QueryOptions } from 'mongoose';
import { RequestDto } from '../dto/request.dto';
import { Request, RequestDocument } from '../repository/request.model';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
  ) {}

  async create(createRequestDto: RequestDto): Promise<Request> {
    const createdRequest = new this.requestModel(createRequestDto);
    return createdRequest.save();
  }

  async findAll(): Promise<Request[]> {
    return this.requestModel.find().exec();
  }

  findAllByCursor() {
    return this.requestModel.find().cursor()
  }

  async getCountOfRequestDocuments() : Promise<number> {
    return this.requestModel.find().count();
  }
}
