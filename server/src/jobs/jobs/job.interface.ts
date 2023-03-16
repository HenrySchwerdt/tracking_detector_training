import { JobEventPublisher } from "./jobEventPublisher.service";

export interface Job {
    execute(jobEventPublisher: JobEventPublisher) : boolean;
    getName(): string;
    getDescription(): string;

}