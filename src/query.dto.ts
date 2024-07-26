import { IsString, Matches, IsIn } from 'class-validator';
import { IsValidDate } from './query-date-validator';

export class WikiGetAllQuery {
  @IsString()
  @IsIn([
    'bn',
    'de',
    'el',
    'en',
    'he',
    'hu',
    'ja',
    'la',
    'sd',
    'sv',
    'ur',
    'zh',
  ])
  language: string;

  @IsValidDate()
  date: string;
}
