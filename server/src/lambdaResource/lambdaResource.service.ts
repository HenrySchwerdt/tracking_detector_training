import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { call } from "funker"
import { LambdaResource, LambdaResourceDocument } from "./lambdaResource.model";
import { TrainingInput } from "./trainingInput";


@Injectable()
export class LambdaResourceService {
    constructor(
        @InjectModel(LambdaResource.name) private lambdaResourceModel: Model<LambdaResourceDocument>,
    ) { }


    async callLambda(input: TrainingInput, callBack: (err: any, result: any) => void) {
        const resources = await this.lambdaResourceModel.find()
        const freeResource = resources.find(resource => !resource.running)
        await this.lambdaResourceModel.updateOne({_id: freeResource.id}, {running: true});
        call(freeResource.containerName, input, (err, res) => {
            this.lambdaResourceModel.updateOne({_id: freeResource.id}, {running: false});
            callBack(err, res);
        })
    }
}