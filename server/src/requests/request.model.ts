import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  id?: string;
  @Prop()
  url: string;
  @Prop()
  frameType: string;
  @Prop()
  method: string;
  @Prop()
  type: string;
  @Prop()
  frameId: number;
  @Prop()
  requestHeaders: any[];
  @Prop()
  initiater: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
