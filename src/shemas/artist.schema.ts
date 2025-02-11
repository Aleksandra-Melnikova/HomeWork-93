import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({ required: true })
  name: string;
  @Prop({ default: null })
  image: string;
  @Prop({ default: null })
  description: string;
  @Prop({ default: false })
  isPublished: boolean;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
