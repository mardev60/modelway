import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Model extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  src_model: string;

  @Prop({ required: true })
  baseURL: string;

  @Prop({ required: true })
  provider_id: string;

  @Prop({ required: true })
  input_price: number;

  @Prop({ required: true })
  output_price: number;

  @Prop({ required: true })
  latency: number;

  @Prop({ required: true, type: Date })
  last_ping: Date;
}

export const ModelSchema = SchemaFactory.createForClass(Model);