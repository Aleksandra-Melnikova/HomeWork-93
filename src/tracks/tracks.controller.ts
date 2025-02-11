import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../shemas/album.schema';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Track, TrackDocument } from '../shemas/track.schema';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}
  @Get()
  getAll() {
    return this.trackModel.find();
  }

  @Get('getQuery')
  async getQuery(@Query('album') album?: string){
    const albumOne = await this.albumModel.findById(album);
    if (!albumOne) {throw new NotFoundError('Album not found');}
    else{
      return this.trackModel.find({album: album});
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/tracks/' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() trackDto: CreateTrackDto,
  ) {
    const albumOne = await this.albumModel.findById(trackDto.album);
    if (!albumOne) {throw new NotFoundError('Album not found');}
    const track = new this.trackModel({
      album: trackDto.album,
      name: trackDto.name,
      time: trackDto.time,
      trackNumber: trackDto.trackNumber,
      linkYouTube: trackDto.linkYouTube,
      isPublished: trackDto.isPublished,
    });
    return track.save();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) throw new NotFoundError('Track not found');
    return track;
  }
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) {
      throw new NotFoundError('Track not found')}
    else{
      await this.trackModel.deleteOne({ _id: id });
    }
    return (`Track with id ${id} has been deleted`);
  }
}

