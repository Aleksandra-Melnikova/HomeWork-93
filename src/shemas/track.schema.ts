import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
  })
  album: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  time: string;
  @Prop({ required: true })
  trackNumber: number;
  @Prop({ default: null })
  linkYouTube: string;
  @Prop({ default: false })
  isPublished: boolean;
  _id: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
