import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../shemas/album.schema';
import { Artist, ArtistDocument } from '../shemas/artist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { NotFoundError } from 'rxjs';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  getAll() {
    return this.albumModel.find();
  }

  @Get('getQuery')
  async getQuery(@Query('artist') artist?: string){
    const artistOne = await this.artistModel.findById(artist);
    if (!artistOne ) {throw new NotFoundError('Artist not found');}
    else{
      return this.albumModel.find({artist: artist});
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/albums/' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumDto: CreateAlbumDto,
  ) {
    const artist = await this.artistModel.findById(albumDto.artist);
    if (!artist) throw new NotFoundError('Category not found');
    const album = new this.albumModel({
      artist: albumDto.artist,
      title:albumDto.title,
      year: albumDto.year,
      isPublished: albumDto.isPublished,
      image: file ? '/uploads/albums/' + file.filename : null,
    });
    return artist.save();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById({ _id: id });
    if (!album) throw new NotFoundError('Album not found');
    return album;
  }
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const artist = await this.albumModel.findById({ _id: id });
    if (!artist) {throw new NotFoundError('Album not found');}
    else{
      await this.albumModel.deleteOne({ _id: id });
    }
    return (`Album with id ${id} has been deleted`);
  }
}
