import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type RequestDocument = HydratedDocument<Request>;

@Schema()
export class Request {
    
}


export const RequestSchema = SchemaFactory.createForClass(Request);