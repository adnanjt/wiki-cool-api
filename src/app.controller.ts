import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService, WikiService } from './app.service';
import { WikiGetAllQuery } from './query.dto';
import { validateOrReject } from 'class-validator';
import { Wiki, WikiDto } from './app.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.healthCheck();
  }
}

@Controller('feed')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  async getAll(@Query() query: WikiGetAllQuery): Promise<Wiki[]> {
    try {
      await validateOrReject(query);
      return this.wikiService.getAll(query);
    } catch (errors) {
      console.log('Validation failed', errors);
    }
  }
  // TODO see what fields are needed because for translation we need to know the spesific content to translkate
  // Display the title, thumbnail image (if available), and a brief excerpt or description for each piece of content.
  // tfa.titles.display
  //   tfa.thumbnail.source
  // tfa.thumbnail.width
  // tfa.thumbnail.height
  // tfa.description

  @Get('translate')
  async getAllTranslate(
    @Query() query: WikiGetAllQuery,
    @Param('language') language: string,
  ): Promise<Wiki[]> {
    try {
      await validateOrReject(query);
      return await this.wikiService.getAll(query);
    } catch (errors) {
      console.log('Validation failed', errors);
    }
  }
}
