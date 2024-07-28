
export interface WikiImage {
    source: string;
    width: number;
    height: number;
}
  
export interface Wiki {
    title: string;
    image?: WikiImage;
    description: string;
    related?: string;
    type: string;
    contentUrl: string;
}
  