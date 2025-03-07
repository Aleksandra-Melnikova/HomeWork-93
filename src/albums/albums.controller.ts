import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../shemas/album.schema';
import { Artist, ArtistDocument } from '../shemas/artist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { diskStorage } from 'multer';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Track } from '../shemas/track.schema';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async get(@Query('artist') artist?: string) {
    if (artist) {
      const artistOne = await this.artistModel.findById(artist);
      if (!artistOne) {
        throw new NotFoundException('Artist not found');
      } else {
        return this.albumModel.find({ artist: artist });
      }
    } else return this.albumModel.find();
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/albums/',
        filename: (req, file, cb) => {
          const filename = file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumDto: CreateAlbumDto,
  ) {
    const artist = await this.artistModel.findById(albumDto.artist);
    if (!artist) throw new NotFoundException('Artist not found');
    const album = new this.albumModel({
      artist: albumDto.artist,
      title: albumDto.title,
      year: albumDto.year,
      isPublished: albumDto.isPublished,
      image: file ? '/uploads/albums/' + file.originalname : null,
    });
    return album.save();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById({ _id: id });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async deleteOne(@Param('id') id: string) {
    const album = await this.albumModel.findById({ _id: id });
    if (!album) {
      throw new NotFoundException('Album not found');
    } else {
      await this.albumModel.deleteOne({ _id: id });
      await this.trackModel.deleteMany({ album: id });
    }
    return `Album with id ${id} has been deleted. All tracks this album have also been deleted.`;
  }
}
