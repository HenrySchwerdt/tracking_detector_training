import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { HydratedDocument } from "mongoose";


export type JobMetaDocument = HydratedDocument<JobMeta>;

@Schema()
export class JobMeta {
    @Prop({ type: String, default: function genUUID() {
        return randomUUID()
    }})
    _id: string;

    @Prop()
    jobName: string;

    @Prop()
    jobDescription: string;

    @Prop()
    lastJobRun: number;

    @Prop()
    cronPattern: string;

    @Prop()
    enabled: boolean;
}


export const JobMetaSchema = SchemaFactory.createForClass(JobMeta);

