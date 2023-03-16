import { Injectable } from "@nestjs/common";
import { Job } from "./job.interface";
import { JobEventPublisher } from "./jobEventPublisher.service";
import { call } from "funker"

export const MODEL_TRAINING_CRON = "*/1 * * * *"

@Injectable()
export class ModelTrainingJob implements Job {


    
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
        

        
        return true;
    }
    
    getName(): string {
        return "ModelTraining";
    }

    getDescription(): string {
        return "This job triggers a python function to train the model on the collected data."
    }

    getCronPattern(): string {
        return MODEL_TRAINING_CRON;
    }

}