import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { call } from 'funker';
import {
  LambdaResource,
  LambdaResourceDocument,
} from '../repository/lambdaResource.model';
import { TrainingInput } from '../lambdaResource/trainingInput';

const resourcesNames: string[] = process.env.RESOURCES.split(',');

@Injectable()
export class LambdaResourceService {
  constructor(
    @InjectModel(LambdaResource.name)
    private lambdaResourceModel: Model<LambdaResourceDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.lambdaResourceModel.deleteMany().exec();
    resourcesNames.forEach((name) => {
      const createdRequest = new this.lambdaResourceModel({
        containerName: name,
        running: false,
      });
      createdRequest.save();
    });
  }

  async callLambda(
    input: TrainingInput,
    callBack: (err: any, result: any) => void,
  ) {
    const resources = await this.lambdaResourceModel.find();
    const freeResource = resources.find((resource) => !resource.running);
    await this.lambdaResourceModel.updateOne(
      { _id: freeResource.id },
      { running: true },
    );
    try {
      call(freeResource.containerName, input, (err, res) => {
        console.log(err, res, "Finished Lambda")
        this.lambdaResourceModel.updateOne(
          { _id: freeResource.id },
          { running: false },
        );
        callBack(err, res);
      });
    } catch(e) {
      this.lambdaResourceModel.updateOne(
        { _id: freeResource.id },
        { running: false },
      );
      callBack(e, null)
    }
    
  }
}
