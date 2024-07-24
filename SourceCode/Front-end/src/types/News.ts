export type News = {
    id?: string;
    news_isDisplay?:string;
    news_content: string;
    news_created_date?:string;
    news_display_date?:string | Date;
    news_date?: string | Date
    news_image:string;
    news_title:string;
    news_description:string;
}
export type NewsResponse = {
    id?: string;
    news_isDisplay?:string;
    news_content: string;
    news_display_date:string | null;
    news_created_date: null | string,
    news_image:string;
    news_title:string;
    news_description:string;
}

export type NewsSearch = {
    id: number,
    news_isDisplay: string | number,
    news_date: string,
    news_title: string,
    news_description: string,
    news_content: string,
    news_image: string,
    responseField:string ,
    searchField: string,
}