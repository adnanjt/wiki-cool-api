import { Injectable, Logger } from '@nestjs/common';
// import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map as rxMapper } from 'rxjs';
import { Wiki, WikiDto, Article } from './app.model';
import { WikiGetAllQuery } from './query.dto';
import he from 'he';

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

  convertDataToWiki(data: WikiDto): Wiki[] {
    const wikiList: Wiki[] = [];
    // TODO: add type to know where the data comes from on wiki api
    if (data.tfa) {
      wikiList.push({
        title: data.tfa.titles.normalized,
        image: data.tfa.thumbnail
          ? {
              source: data.tfa.thumbnail.source,
              width: data.tfa.thumbnail.width,
              height: data.tfa.thumbnail.height,
            }
          : null,
        description: data.tfa.description,
      });
    }

    if (data.mostread) {
      data.mostread.articles.forEach((article) => {
        // this.logger.log(article);

        wikiList.push({
          title: article.titles.normalized,
          image: article.thumbnail
            ? {
                source: article.thumbnail.source,
                width: article.thumbnail.width,
                height: article.thumbnail.height,
              }
            : null,
          description: article.description,
        });
      });
    }

    if (data.picture) {
      wikiList.push({
        title: data.picture.title,
        image: data.picture.thumbnail
          ? {
              source: data.picture.thumbnail.source,
              width: data.picture.thumbnail.width,
              height: data.picture.thumbnail.height,
            }
          : null,
        description: data.picture.description.text,
      });
    }

    // this.logger.log(data);
    if(data.news) {
      // this.logger.log(data.news);

      data.news.forEach(news => news.links.forEach(link => {
        // this.logger.log(link);
        wikiList.push({
          title: link.titles.normalized,
          image: link.thumbnail
            ? {
                source: link.thumbnail.source,
                width: link.thumbnail.width,
                height: link.thumbnail.height,
              }
            : null,
          description: link.description,
          // related: stripHtml(he.decode(decodeUnicode(news.story)))
        });
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
