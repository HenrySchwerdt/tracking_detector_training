import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
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
    @ApiProperty({example: "ad12321asd1213", description: "The unique job run id."})
    id?: string;
    
    @Prop()
    @ApiProperty({example: "ad12321asd1213", description: "The unique job id for that run."})
    jobId: string;

    @Prop()
    @ApiProperty({example: "SUCCESS", description: "The current status of the job."})
    status: string;

    @Prop()
    @ApiProperty({example: 1231231231, description: "The starting time in miliseconds."})
    startTime: number;

    @Prop()
    @ApiProperty({example: 1231231231, description: "The ending time in miliseconds."})
    endTime: number;

    @Prop()
    @ApiProperty({description: "The jobLogs for a specific job run."})
    logs: string;
}


export const JobRunSchema = SchemaFactory.createForClass(JobRun);