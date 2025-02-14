import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../shemas/artist.schema';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
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

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById({ _id: id });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    } else {
      await this.artistModel.deleteOne({ _id: id });
    }
    return `Artist with id ${id} has been deleted`;
  }
}
