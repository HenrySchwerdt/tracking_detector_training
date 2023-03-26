import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

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
  @ApiProperty({ example: 'ad12321asd1213', description: 'The unique job id.' })
  id?: string;
  @ApiProperty({ example: 'XXXJob', description: 'The unique job name.' })
  @Prop()
  jobName: string;
  @ApiProperty({ example: 'This job ...', description: 'The job description.' })
  @Prop()
  jobDescription: string;
  @ApiProperty({
    example: 1231232,
    description: 'Last job run date in miliseconds.',
  })
  @Prop()
  lastJobRun: number;
  @ApiProperty({
    example: '* * * 1 *',
    description: 'The cron pattern for the jobs when to start.',
  })
  @Prop()
  cronPattern: string;
  @ApiProperty({
    example: true,
    description: 'Bool to determine weather the job is enabled.',
  })
  @Prop()
  enabled: boolean;
}

export const JobMetaSchema = SchemaFactory.createForClass(JobMeta);
