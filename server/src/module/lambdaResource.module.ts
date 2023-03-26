import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LambdaResource,
  LambdaResourceSchema,
} from '../repository/lambdaResource.model';
import { LambdaResourceService } from '../service/lambdaResource.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LambdaResource.name, schema: LambdaResourceSchema },
    ]),
  ],
  providers: [LambdaResourceService],
  exports: [
    LambdaResourceService,
    MongooseModule.forFeature([
      { name: LambdaResource.name, schema: LambdaResourceSchema },
    ]),
  ],
})
export class LambdaResourceModule {}
