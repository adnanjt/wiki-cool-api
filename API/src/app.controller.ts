import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  Catch,
} from '@nestjs/common';
import { AppService, WikiService } from './app.service';
import { WikiGetAllQuery } from './query.dto';
import { Wiki } from './app.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.healthCheck();
  }
}

@Controller('feed')
@Catch(HttpException)
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  async getAll(@Query() query: WikiGetAllQuery): Promise<Wiki[]> {
    return await this.wikiService.getAll(query);
  }

  @Get('translate:language')
  async getAllTranslate(
    @Query() query: WikiGetAllQuery,
    @Param('language') language: any,
  ): Promise<Wiki[]> {
      return await this.wikiService.postTranslate({
        ...query,
        targerLanguage: language,
      });
  }
}
