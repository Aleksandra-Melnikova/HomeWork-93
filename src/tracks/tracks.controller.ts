import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../shemas/album.schema';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../shemas/track.schema';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async get(@Query('album') album?: string) {
    if (album) {
      const albumOne = await this.albumModel.findById(album);
      if (!albumOne) {
        throw new NotFoundException('Album not found');
      } else {
        return this.trackModel.find({ album: album });
      }
    } else return this.trackModel.find();
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() trackDto: CreateTrackDto) {
    const albumOne = await this.albumModel.findById(trackDto.album);
    if (!albumOne) {
      throw new NotFoundException('Album not found');
    } else {
      const track = new this.trackModel({
        album: trackDto.album,
        name: trackDto.name,
        time: trackDto.time,
        trackNumber: trackDto.trackNumber,
        linkYouTube: trackDto.linkYouTube,
        isPublished: trackDto.isPublished,
      });
      return await track.save();
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async deleteOne(@Param('id') id: string) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) {
      throw new NotFoundException('Track not found');
    } else {
      await this.trackModel.deleteOne({ _id: id });
    }
    return `Track with id ${id} has been deleted`;
  }
}
