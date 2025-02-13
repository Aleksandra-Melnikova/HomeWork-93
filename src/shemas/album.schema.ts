import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  })
  artist: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: true })
  year: number;
  @Prop({ default: false })
  isPublished: boolean;
  @Prop({ default: null })
  image: string;
  _id: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
