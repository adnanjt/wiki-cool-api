import { Injectable, Logger } from '@nestjs/common';
// import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map as rxMapper } from 'rxjs';
import { Wiki, WikiDto, Article } from './app.model';
import { WikiGetAllQuery } from './query.dto';
import {decode as heDecode} from 'he';

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
    related?: string
  ): Wiki {
    return {
      title,
      image: thumbnail ? { source: thumbnail.source, width: thumbnail.width, height: thumbnail.height } : null,
      description,
      type,
      related
    };
  }

  // addWikiToList(content: ): void {
  //   if(data.onthisday) {
  //     data.onthisday.forEach(day => day.pages.forEach(page => {
  //       wikiList.push(this.createWikiObject(
  //         page.titles.normalized,
  //         page.thumbnail,
  //         page.description,
  //         "onthisday",
  //         day.text
  //       ));
  //     }));
  //   }
  // }

  convertDataToWiki(data: WikiDto): Wiki[] {
    const wikiList: Wiki[] = [];
    // TODO: improve this to reuse
    if (data.tfa) {
      wikiList.push(this.createWikiObject(
        data.tfa.titles.normalized,
        data.tfa.thumbnail,
        data.tfa.description,
        "tfa"
      ));
    }

    if (data.mostread) {
      data.mostread.articles.forEach((article) => {
        wikiList.push(this.createWikiObject(
          article.titles.normalized,
          article.thumbnail,
          article.description,
          "mostread"
        ));
      });
    }

    if (data.picture) {
      wikiList.push(this.createWikiObject(
        data.picture.title,
        data.picture.thumbnail,
        data.picture.description.text,
        "picture"
      ));
    }

    if(data.news) {
      data.news.forEach(news => news.links.forEach(link => {
        wikiList.push(this.createWikiObject(
          link.titles.normalized,
          link.thumbnail,
          link.description,
          "news",
          stripHtml(heDecode(decodeUnicode(news.story)))
        ));
      }));
    }

    if(data.onthisday) {
      data.onthisday.forEach(day => day.pages.forEach(page => {
        wikiList.push(this.createWikiObject(
          page.titles.normalized,
          page.thumbnail,
          page.description,
          "onthisday",
          day.text
        ));
      }));
    }

    return wikiList;
  }

  async getAll(query: WikiGetAllQuery): Promise<Wiki[]> {
    this.logger.log(query);
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
  }
}

@Injectable()
export class TranslateService {
  constructor() {}
}
