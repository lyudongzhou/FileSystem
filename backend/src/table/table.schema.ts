import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Table extends Document {
  @Prop({ required: true })
  userName: string;
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  url: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);
