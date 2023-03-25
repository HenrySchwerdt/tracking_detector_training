import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type RequestDocument = HydratedDocument<Request>;

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
export class Request {
  @ApiProperty({example: "1212csdaasd1212", description: "The unique object id."})
  id?: string;
  @ApiProperty({example: "https://www.google.de", description: "The url the requests wants to call"})
  @Prop()
  url: string;
  @ApiProperty({example: "outermost_frame", description: "Outermost frame attribute provided by chrome"})
  @Prop()
  frameType: string;
  @ApiProperty({example: "GET", description: "The request method"})
  @Prop()
  method: string;
  @ApiProperty({example: "xmlhttprequest", description: "The request type provided by chrome"})
  @Prop()
  type: string;
  @ApiProperty({example: "1", description: "The frame Id provided by chrome"})
  @Prop()
  frameId: number;
  @ApiProperty({example: [{"Accept": "application/json"}], description: "The requestheaders provided by chrome"})
  @Prop()
  requestHeaders: any[];
  @ApiProperty({example: "google.com", description: "The request initiator"})
  @Prop()
  initiater: string;
  @ApiProperty({example: true, description: "The label true: Tracking, false: non-Tracking"})
  @Prop()
  label: boolean;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
