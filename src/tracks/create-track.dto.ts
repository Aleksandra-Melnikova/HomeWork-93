import { Prop } from '@nestjs/mongoose';

export class CreateTrackDto {
  album: string;
  name: string;
  time: string;
  trackNumber: number;
  linkYouTube: string;
  isPublished: boolean;
}
