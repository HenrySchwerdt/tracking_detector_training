import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type JobRunDocument = HydratedDocument<JobRun>;

@Schema()
export class JobRun {
    @Prop()
    _id: string;

    @Prop()
    status: string;

    @Prop()
    startTime: number;

    @Prop()
    endTime: number;

    @Prop()
    logs: string;
}


export const JobRunSchema = SchemaFactory.createForClass(JobRun);