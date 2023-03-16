import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type JobMetaDocument = HydratedDocument<JobMeta>;

@Schema()
export class JobMeta {
    @Prop()
    id: string;

    @Prop()
    jobName: string;

    @Prop()
    jobDescription: string;

    @Prop()
    lastJobRun: string;

    @Prop()
    cronPattern: string;

    @Prop()
    enabled: boolean;
}


export const JobMetaSchema = SchemaFactory.createForClass(JobMeta);