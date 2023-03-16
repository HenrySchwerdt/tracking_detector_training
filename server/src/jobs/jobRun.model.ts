import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type JobRunDocument = HydratedDocument<JobRun>;

@Schema()
export class JobRun {
    @Prop()
    id: string;

    @Prop()
    status: string;

    @Prop()
    startTime: Date;

    @Prop()
    endTime: Date;
}


export const JobRunSchema = SchemaFactory.createForClass(JobRun);