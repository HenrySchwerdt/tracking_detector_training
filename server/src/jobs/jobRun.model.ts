import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type JobRunDocument = HydratedDocument<JobRun>;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            delete ret._id;
            delete ret.__v;
        },
    },
    toObject: {
        virtuals: true,
        transform(doc, ret) {
            doc.id = ret._id;
        },
    },
})
export class JobRun {
    id?: string;
    
    @Prop()
    jobId: string;

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