import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../shemas/artist.schema';
import { CreateArtistDto } from './create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotFoundError } from 'rxjs';

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
    if (!artist) throw new NotFoundError('Product not found');
    return artist;
  }


  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/artists/' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() ArtistDto: CreateArtistDto) {
    const artist = new this.artistModel({
      name: ArtistDto.name,
      description: ArtistDto.description,
      isPublished: ArtistDto.isPublished,
      image: file ? '/uploads/artists/' + file.filename : null,
    });
    return await artist.save();
  }
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById({ _id: id });
    if (!artist) {throw new NotFoundError('Product not found');}
    else{
      await this.artistModel.deleteOne({ _id: id });
    }
    return (`Artist with id ${id} has been deleted`);
  }
}
