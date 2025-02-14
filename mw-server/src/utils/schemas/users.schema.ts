import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 0 })
  credits: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  displayName?: string;

  @Prop()
  photoURL?: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 