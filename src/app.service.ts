import { Injectable, Logger } from '@nestjs/common';
// import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map as rxMapper } from 'rxjs';
import { Wiki, WikiDto, Article } from './app.model';
import { WikiGetAllQuery } from './query.dto';

@Injectable()
export class AppService {
  constructor() {}
  healthCheck(): string {
    return 'Api is up';
  }
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
    // TODO check why news causes an error
    // if(data.news) {
    //   if(data.news.links){
    //     this.logger.log(data.news.links);
    //   }

    //   // data.news.links.forEach(article => {

    //   //   this.logger.log(article);

    //   //   wikiList.push({
    //   //     title: article.titles.normalized,
    //   //     image: article.thumbnail? { source:article.thumbnail.source, width:article.thumbnail.width, height: article.thumbnail.height }: null,
    //   //     description: article.description
    //   //   });
    //   // });
    // }

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
          //   // this.convertDataToWiki(result.data)
          //   // this.logger.log(result.data.tfa)
          //   return result
          // }),
          catchError((error) => {
            this.logger.error(error);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
    return this.convertDataToWiki(data);
  }
}

@Injectable()
export class TranslateService {
  constructor() {}
}
