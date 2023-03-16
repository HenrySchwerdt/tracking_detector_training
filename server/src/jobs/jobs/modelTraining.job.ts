import { Injectable } from "@nestjs/common";
import { Job } from "./job.interface";
import { JobEventPublisher } from "./jobEventPublisher.service";

export const MODEL_TRAINING_CRON = "*/1 * * * *"

@Injectable()
export class ModelTrainingJob implements Job {


    
    execute(jobEventPublisher : JobEventPublisher): boolean {
        jobEventPublisher.info("Training Job Started")
        console.log("Hallo Welt");
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