import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { FixturesService } from './src/fixtures';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fixturesService = app.get(FixturesService);
  await fixturesService.createFixtures();
  console.log('Fixtures have been created!');
  await app.close();
}

bootstrap();
