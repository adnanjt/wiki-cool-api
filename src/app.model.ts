export interface WikiDto {
  tfa: TodayFeatured;
  mostread: MostRead;
  picture: PictureOfTheDay;
  news: News;
  onthisday: OnThisDay[];
}

export interface TodayFeatured {
  titles: Titles;
  thumbnail?: Thumbnail;
  description: string;
  extract: string;
  content_urls: ContentUrls;
}

export interface Titles {
  normalized: string;
  display: string;
  canonical: string;
}

export interface Thumbnail {
  source: string;
  width: number;
  height: number;
}

export interface ContentUrls {
  desktop: Desktop;
  mobile: Mobile;
}

export interface Desktop {
  page: string;
  revisions: string;
  edit: string;
  talk: string;
}

export interface Mobile {
  page: string;
  revisions: string;
  edit: string;
  talk: string;
}

export interface MostRead {
  articles: Article[];
  date: string;
}

export interface Article {
  title: string;
  titles: Titles;
  normalizedtitle: string;
  thumbnail?: Thumbnail;
  pageviews: number;
  rank: number;
  description: string;
}

export interface PictureOfTheDayDescription {
  text: string;
}

export interface PictureOfTheDay {
  title: string;
  thumbnail: Thumbnail;
  description: PictureOfTheDayDescription;
}

export interface Story {
  story: string;
  image: Image;
  date: string;
}

export interface News {
  story: string;
  links?: Article[];
}

export interface Image {
  thumbnail: Thumbnail;
}

export interface OnThisDay {
  text: string;
  year: number;
  pages: Page[];
}

export interface Page {
  type: string;
  title: string;
  displaytitle: string;
  namespace: Namespace;
  wikibase_item: string;
  titles: Titles;
  thumbnail: Thumbnail;
  description: string;
  content_urls: ContentUrls;
}

export interface Namespace {
  id: number;
  text: string;
}

interface WikiImage {
  source: string;
  width: number;
  height: number;
}

// interface TodayFeatured {
//   titles: Title;
//   thumbnail: Thumbnail;
//   description: string;
// };

export interface Wiki {
  title: string;
  image?: WikiImage;
  description: string;
}
