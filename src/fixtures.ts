import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from './shemas/album.schema';
import { Track } from './shemas/track.schema';
import { Artist } from './shemas/artist.schema';
import { User } from './shemas/user.schema';
import { randomUUID } from 'node:crypto';

@Injectable()
export class FixturesService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    @InjectModel(Track.name) private trackModel: Model<Track>,
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createFixtures() {
    await this.clearCollections();
    const [zhukovArtist, gagarinaArtist, noizeMCArtist] =
      await this.createArtists();
    const [
      In_search_of_tendernessAlbum,
      TerritoryAlbum,
      Ask_the_cloudsAlbum,
      InhaleAlbum,
      SlowsAlbum,
    ] = await this.createAlbums(zhukovArtist, gagarinaArtist);

    await this.createTracks(
      In_search_of_tendernessAlbum,
      TerritoryAlbum,
      Ask_the_cloudsAlbum,
      InhaleAlbum,
      SlowsAlbum,
    );

    await this.createUsers();

  }

  private async clearCollections() {
    try {
      await this.artistModel.deleteMany({});
      await this.albumModel.deleteMany({});
      await this.trackModel.deleteMany({});
      await this.userModel.deleteMany({});
    } catch (error) {
      console.log('Error clearing collections:', error);
    }
  }

  private async createArtists() {
    return this.artistModel.create([
      {
        name: 'Sergei Zhukov',
        description: 'Sergey Evgenievich Zhukov (born May 22, 1976)...',
        image: 'fixtures/Zhukov.jpg',
        isPublished: true,
      },
      {
        name: 'Polina Gagarina',
        description: 'Polina Sergeevna Gagarina (born March 27, 1987)...',
        image: 'fixtures/Gagarina.jpg',
        isPublished: true,
      },
      {
        name: 'Noize MC',
        description:
          'Ivan Aleksandrovich Alekseev is a Russian rap-rock performer...',
        image: 'fixtures/NoizeMC.jpg',
        isPublished: false,
      },
    ]);
  }

  private async createAlbums(zhukovArtist: Artist, gagarinaArtist: Artist) {
    return this.albumModel.create([
      {
        artist: zhukovArtist._id,
        title: 'In search of tenderness',
        year: 2007,
        image: 'fixtures/nezhnost.jpg',
        isPublished: true,
      },
      {
        artist: zhukovArtist._id,
        title: 'Territory',
        year: 2002,
        image: 'fixtures/territoria.jpeg',
        isPublished: true,
      },
      {
        artist: gagarinaArtist._id,
        title: 'Ask the clouds',
        year: 2013,
        image: 'fixtures/clouds.jpeg',
        isPublished: true,
      },
      {
        artist: gagarinaArtist._id,
        title: 'Ihnail',
        year: 2022,
        image: 'fixtures/Ihnail.jpeg',
        isPublished: true,
      },
      {
        artist: zhukovArtist._id,
        title: 'Slows',
        year: 2014,
        image: 'fixtures/slow.jpeg',
        isPublished: false,
      },
    ]);
  }

  private async createTracks(
    In_search_of_tendernessAlbum: Album,
    TerritoryAlbum: Album,
    Ask_the_cloudsAlbum: Album,
    InhaleAlbum: Album,
    SlowsAlbum: Album,
  ) {
    await this.trackModel.create([
      {
        album: In_search_of_tendernessAlbum._id,
        name: "Let's Hide Behind the Rain...",
        time: '04:38',
        trackNumber: 1,
        linkYouTube: 'https://www.youtube.com/watch?v=nJfyQSa9rVQ',
        isPublished: true,
      },
      {
        album: In_search_of_tendernessAlbum._id,
        name: 'Summer Evening',
        time: '04:34',
        trackNumber: 2,
        linkYouTube: 'https://www.youtube.com/watch?v=IcAmrCULkPM',
        isPublished: true,
      },
      {
        album: In_search_of_tendernessAlbum._id,
        name: 'Why Do You Talk About Love?',
        time: '04:19',
        trackNumber: 3,
        linkYouTube: 'https://www.youtube.com/watch?v=IcAmrCULkPM',
        isPublished: true,
      },
      {
        album: In_search_of_tendernessAlbum._id,
        name: 'Tears are dripping',
        time: '04:14',
        trackNumber: 4,
        linkYouTube: 'https://www.youtube.com/watch?v=SKLglsJ8VUE',
        isPublished: true,
      },
      {
        album: In_search_of_tendernessAlbum._id,
        name: 'Roses',
        time: '04:09',
        trackNumber: 5,
        linkYouTube: 'https://www.youtube.com/watch?v=ahKXU2T9xYU',
        isPublished: true,
      },
      {
        album: TerritoryAlbum._id,
        name: 'Whirlpool',
        time: '04:48',
        trackNumber: 6,
        linkYouTube: 'https://www.youtube.com/watch?v=ahKXU2T9xYU',
        isPublished: true,
      },
      {
        album: TerritoryAlbum._id,
        name: 'Wait for me, my love',
        time: '03:29',
        trackNumber: 7,
        linkYouTube: 'https://www.youtube.com/watch?v=rktVxcjZU1o',
        isPublished: true,
      },
      {
        album: TerritoryAlbum._id,
        name: 'Let You',
        time: '04:25',
        trackNumber: 8,
        linkYouTube: 'https://www.youtube.com/watch?v=ZyEoPjNA-o8',
        isPublished: true,
      },
      {
        album: TerritoryAlbum._id,
        name: 'Next to You',
        time: '03:19',
        trackNumber: 9,
        linkYouTube: 'https://www.youtube.com/watch?v=ZyEoPjNA-o8',
        isPublished: true,
      },
      {
        album: TerritoryAlbum._id,
        name: 'Separate',
        time: '04:08',
        trackNumber: 10,
        linkYouTube: 'https://www.youtube.com/watch?v=rktVxcjZU1o',
        isPublished: true,
      },
      {
        album: Ask_the_cloudsAlbum._id,
        name: ' I am yours',
        time: '03:17',
        trackNumber: 11,
        linkYouTube: 'https://www.youtube.com/watch?v=jZFbMmbQ9Fs',
        isPublished: true,
      },
      {
        album: Ask_the_cloudsAlbum._id,
        name: '  Wind',
        time: '03:42',
        trackNumber: 12,
        linkYouTube: 'https://www.youtube.com/watch?v=thtFvrl68-U',
        isPublished: true,
      },
      {
        album: Ask_the_cloudsAlbum._id,
        name: ' Give Up',
        time: '02:55',
        trackNumber: 13,
        linkYouTube: 'https://www.youtube.com/watch?v=thtFvrl68-U',
        isPublished: true,
      },
      {
        album: Ask_the_cloudsAlbum._id,
        name: 'Morning',
        time: '03:43',
        trackNumber: 14,
        linkYouTube: 'https://www.youtube.com/watch?v=PeggbKkZ8mk',
        isPublished: true,
      },
      {
        album: Ask_the_cloudsAlbum._id,
        name: 'I will never forgive you',
        time: '04:15',
        trackNumber: 15,
        linkYouTube: 'https://www.youtube.com/watch?v=PeggbKkZ8mk',
        isPublished: true,
      },
      {
        album: InhaleAlbum._id,
        name: 'Butterflies',
        time: '03:08',
        trackNumber: 16,
        linkYouTube: 'https://www.youtube.com/watch?v=tF_zhKxcH2s',
        isPublished: true,
      },
      {
        album: InhaleAlbum._id,
        name: 'Inhale',
        time: '02:59',
        trackNumber: 17,
        linkYouTube: 'https://www.youtube.com/watch?v=yqqTBS7LFQU',
        isPublished: true,
      },
      {
        album: InhaleAlbum._id,
        name: 'Shadows',
        time: '03:36',
        trackNumber: 18,
        linkYouTube: 'https://www.youtube.com/watch?v=qhrKHMY8EGM',
        isPublished: true,
      },
      {
        album: InhaleAlbum._id,
        name: 'They cried',
        time: '03:10',
        trackNumber: 19,
        linkYouTube: 'https://www.youtube.com/watch?v=HC30C2Ae6rE',
        isPublished: true,
      },
      {
        album: InhaleAlbum._id,
        name: ' Water',
        time: '03:07',
        trackNumber: 20,
        linkYouTube: 'https://www.youtube.com/watch?v=gv3s0hvq_p8',
        isPublished: true,
      },
      {
        album: InhaleAlbum._id,
        name: 'Last November',
        time: '02:54',
        trackNumber: 21,
        linkYouTube: 'https://www.youtube.com/watch?v=U4ePu42Ifsw',
        isPublished: false,
      },
      {
        album: TerritoryAlbum._id,
        name: 'Territory',
        time: '03:47',
        trackNumber: 11,
        linkYouTube: 'https://www.youtube.com/watch?v=eLyYtY4UEp0',
        isPublished: false,
      },
      {
        album: SlowsAlbum._id,
        name: "I won't give you to anyone",
        time: '04:43',
        trackNumber: 1,
        linkYouTube: 'https://www.youtube.com/watch?v=B2WtDYCJRvQ',
        isPublished: false,
      },
    ]);
  }
  private async createUsers() {
    return this.userModel.create([
      {
        email: 'ivan@example.com',
        password: '123',
        token: randomUUID(),
        displayName: 'Ivan Ivanov',
        role: 'admin',
      },
      {
        email: 'maria@example.com',
        password: '123',
        token: randomUUID(),
        displayName: 'Maria Sydorova',
        role: 'user',
      },
    ]);
  }
}
