import { BaseSchema } from '@/common/base.schema';
import { SchemaName } from '@/common/interfaces/schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export type CategoryDocument = Category & Document<mongoose.Schema.Types.ObjectId>;

@Schema({
  timestamps: true,
  collection: SchemaName.CATEGORY,
})
export class Category extends BaseSchema {
  @Prop({ required: true, index: true })
  name!: string;

  @Prop({ required: true, unique: true })
  path!: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop({ index: true })
  order?: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name, required: true }] })
  ancestors!: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null, ref: Category.name })
  parent!: string | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
