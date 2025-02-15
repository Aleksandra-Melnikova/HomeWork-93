import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../shemas/artist.schema';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Album, AlbumDocument } from '../shemas/album.schema';
import { Track } from '../shemas/track.schema';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById({ _id: id });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/artists/',
        filename: (req, file, cb) => {
          const filename = file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() ArtistDto: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      name: ArtistDto.name,
      description: ArtistDto.description,
      isPublished: ArtistDto.isPublished,
      image: file ? '/uploads/artists/' + file.originalname : null,
    });
    return await artist.save();
  }

  @UseGuards(TokenAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById({ _id: id });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    } else {
      const albumsNew = await this.albumModel.find({ artist: artist._id });
      await this.artistModel.deleteOne({ _id: id });
      await this.albumModel.deleteMany({ artist: artist._id });
      for (let i = 0; i < albumsNew.length; i++) {
        await this.trackModel.deleteMany({ album: albumsNew[i]._id });
      }
    }
    return `Artist with id ${id} has been deleted. All of his albums and tracks have also been deleted.`;
  }
}
