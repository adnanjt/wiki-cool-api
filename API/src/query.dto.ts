import { IsString, IsIn } from 'class-validator';
import { IsValidDate } from './query-date-validator';

const languageCodesWiki = [
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
  'bs',
  'da',
  'es',
  'fi',
  'fr',
  'ko',
  'no',
  'pl',
  'pt',
  'ru',
  'sco',
  'vi',
  'ar',
];

const languageCodesTranslate = [
  'ar',
  'az',
  'bg',
  'bn',
  'ca',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'fa',
  'fi',
  'fr',
  'ga',
  'he',
  'hi',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'lt',
  'lv',
  'ms',
  'nb',
  'nl',
  'pl',
  'pt',
  'ro',
  'ru',
  'sk',
  'sl',
  'sq',
  'sr',
  'sv',
  'th',
  'tl',
  'tr',
  'uk',
  'ur',
  'vi',
  'zh',
  'zt',
];

export class WikiGetAllQuery {
  @IsString()
  @IsIn(languageCodesWiki)
  language: string;

  @IsValidDate()
  date: string;

  @IsIn(languageCodesTranslate)
  targerLanguage?: string;
}
