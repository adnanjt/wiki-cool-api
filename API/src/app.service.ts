import { Injectable, Logger,   HttpException,
  HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Wiki, WikiDto, TranslateDto } from './app.model';
import { WikiGetAllQuery } from './query.dto';
import { decode as heDecode } from 'he';
import { AxiosRequestConfig } from 'axios';
import { validateOrReject } from 'class-validator';

@Injectable()
export class AppService {
  constructor() {}
  healthCheck(): string {
    return 'Api is up';
  }
}

function decodeUnicode(str) {
  return str.replace(/\\u([\dA-F]{4})/gi, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 16));
  });
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

@Injectable()
export class WikiService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger('WikiService');

  createWikiObject(
    title: string,
    thumbnail: { source: string; width: number; height: number } | null,
    description: string,
    type: string,
    contentUrl: string,
    related?: string,
  ): Wiki {
    return {
      title,
      image: thumbnail
        ? {
            source: thumbnail.source,
            width: thumbnail.width,
            height: thumbnail.height,
          }
        : null,
      description,
      type,
      related,
      contentUrl,
    };
  }

  convertDataToWiki(data: WikiDto): Wiki[] {
    const wikiList: Wiki[] = [];
    if (data.tfa) {
      wikiList.push(
        this.createWikiObject(
          data.tfa.titles.normalized,
          data.tfa.thumbnail,
          data.tfa.description,
          'tfa',
          data.tfa.content_urls.desktop.page,
        ),
      );
    }

    if (data.mostread) {
      data.mostread.articles.forEach((article) => {
        wikiList.push(
          this.createWikiObject(
            article.titles.normalized,
            article.thumbnail,
            article.description,
            'mostread',
            article.content_urls.desktop.page,
          ),
        );
      });
    }
    this.logger.log(data.image)
    if (data.image) {
      wikiList.push(
        this.createWikiObject(
          data.image.title,
          data.image.thumbnail,
          data.image.description.text,
          'image',
          data.image.thumbnail.source,
        ),
      );
    }

    if (data.news) {
      data.news.forEach((news) =>
        news.links.forEach((link) => {
          wikiList.push(
            this.createWikiObject(
              link.titles.normalized,
              link.thumbnail,
              link.description,
              'news',
              link.content_urls.desktop.page,
              stripHtml(heDecode(decodeUnicode(news.story))),
            ),
          );
        }),
      );
    }

    if (data.onthisday) {
      data.onthisday.forEach((day) =>
        day.pages.forEach((page) => {
          wikiList.push(
            this.createWikiObject(
              page.titles.normalized,
              page.thumbnail,
              page.description,
              'onthisday',
              page.content_urls.desktop.page,
              day.text,
            ),
          );
        }),
      );
    }

    return wikiList;
  }

  async getAll(query: WikiGetAllQuery): Promise<Wiki[]> {
    try {
      await validateOrReject(query);
    } catch (errors) {
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
      const { data } = await firstValueFrom(
        this.httpService
          .get<WikiDto>(
            `https://api.wikimedia.org/feed/v1/wikipedia/${query.language}/featured/${query.date}`,
          )
          .pipe(
            // rxMapper(result => {
            //   this.logger.log(result.data);
            //   return result
            // }),
            catchError((error) => {
              this.logger.error(error);
              throw 'An error happened!';
            }),
          ),
      );

      return this.convertDataToWiki(data);
    } catch (errors) {
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

  async postTranslate(query: WikiGetAllQuery): Promise<Wiki[]> {
    try {
      await validateOrReject(query);
    } catch (errors) {
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
      this.logger.log(query);
      const targerLanguage = query.targerLanguage
        ? query.targerLanguage.substring(1)
        : 'en';
      const dataWikiQuery = await this.getAll(query);

      const translationArrayString = dataWikiQuery
      .map((wiki, index) => `${index},${wiki.title},${wiki.description}`)
      .join('\n');

      const payload = JSON.stringify({
        q: translationArrayString,
        source: query.language,
        target: targerLanguage,
      });

      this.logger.log(payload);
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await firstValueFrom(
        this.httpService
          .post<TranslateDto>(
            `http://localhost:5000/translate`,
            payload,
            requestConfig,
          )
          .pipe(
            catchError((error) => {
              this.logger.error(error);
              throw 'An error happened!';
            }),
          ),
      );

      this.logger.log(data.translatedText);


      const translationResult = data.translatedText
      .split('\n')
      .map(line => {
        const [index, title, description] = line.split(',');
        return { 0: Number(index), 1: title, 2: description };
      });

      const result: Wiki[] = dataWikiQuery.map((wiki, index) => ({
        ...wiki,
        title: translationResult[index][1],
        description: translationResult[index][2],
      }));


      return result;
    } catch (errors) {
      console.log('Service failed', errors);
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

@Injectable()
export class TranslateService {
  constructor() {}
}
