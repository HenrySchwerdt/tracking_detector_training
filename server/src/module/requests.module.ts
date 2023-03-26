import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from '../repository/request.model';
import { RequestsController } from '../controller/requests.controller';
import { RequestsService } from '../service/requests.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [
    RequestsService,
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
  ],
})
export class RequestsModule {}
