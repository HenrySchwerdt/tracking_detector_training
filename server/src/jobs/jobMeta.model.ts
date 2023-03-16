import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import mongoose, { HydratedDocument } from "mongoose";


export type JobMetaDocument = HydratedDocument<JobMeta>;

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
export class JobMeta {
    id? : string;

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

