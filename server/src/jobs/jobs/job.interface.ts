import { JobEventPublisher } from "./jobEventPublisher.service";

export interface Job {
    execute(jobEventPublisher: JobEventPublisher) : Promise<boolean>;
    getName(): string;
    getDescription(): string;
    getCronPattern(): string;

}