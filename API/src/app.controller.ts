import { Controller, Get, Param, Query, HttpException, HttpStatus, Catch } from '@nestjs/common';
import { AppService, WikiService } from './app.service';
import { WikiGetAllQuery } from './query.dto';
import { validateOrReject } from 'class-validator';
import { Wiki } from './app.model';
import { Logger } from '@nestjs/common';
const logger = new Logger('WikiService');

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
    try {
      await validateOrReject(query);
      return this.wikiService.getAll(query);
    } catch (errors) {
      console.log('Validation failed', errors);
    }
  }
  
  @Get('translate:language')
  async getAllTranslate(
    @Query() query: WikiGetAllQuery,
    @Param('language') language: any,
  ): Promise<Wiki[]> {


    
    try {
      await validateOrReject(query);
    } catch (errors) {
      console.log(errors);
      console.log('Validation failed', errors);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors,
        },
        HttpStatus.BAD_REQUEST,
      );  
    }

    try {
      logger.log(language);
      return await this.wikiService.postTranslate({...query, targerLanguage: language});
    } catch (errors) {
      console.log(errors);
      console.log('Error On querry', errors);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Service failed',
          errors,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  
    }
  }
}
