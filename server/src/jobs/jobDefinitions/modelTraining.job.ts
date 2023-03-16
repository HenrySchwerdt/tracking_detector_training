import { Injectable } from "@nestjs/common";
import { Job } from "./job.interface";
import { JobEventPublisher } from "./jobEventPublisher.service";
import { call } from "funker"
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobMeta, JobMetaDocument } from "../jobMeta.model";

export const MODEL_TRAINING_JOB_CRON = "*/1 * * * *"

@Injectable()
export class ModelTrainingJob extends Job {

    constructor(@InjectModel(JobMeta.name) jobMetaModel: Model<JobMetaDocument>) {
        super(jobMetaModel);
    }

    async execute(jobEventPublisher : JobEventPublisher): Promise<boolean> {
        return new Promise(resolve => {
            jobEventPublisher.info("Training Job Started")
            call("training", {x: 3, y:5}, (err, res) => {
                if (err) {
                    jobEventPublisher.error("Error occured ")
                    resolve(false);
                }
                jobEventPublisher.info("Result: ", JSON.stringify(res));
                resolve(true);
            })
        })
    }
    
    getName(): string {
        return "ModelTraining";
    }

    getDescription(): string {
        return "This job triggers a python function to train the model on the collected data."
    }

    getCronPattern(): string {
        return MODEL_TRAINING_JOB_CRON;
    }

}