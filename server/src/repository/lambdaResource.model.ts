import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type LambdaResourceDocument = HydratedDocument<LambdaResource>;

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
export class LambdaResource {
  @ApiProperty({
    example: '1212csdaasd1212',
    description: 'The unique resource id.',
  })
  id?: string;
  @ApiProperty({
    example: 'training1',
    description: 'The lambda container name',
  })
  @Prop({ unique: true })
  containerName: string;
  @ApiProperty({
    example: true,
    description: 'Is the container currently running',
  })
  @Prop()
  running: boolean;
}

export const LambdaResourceSchema =
  SchemaFactory.createForClass(LambdaResource);
