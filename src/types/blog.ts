export interface ArticleContent {
  type: string;
  children?: ArticleContent[];
  text?: string;
  bold?: boolean;
  url?: string;
  level?: number;
  image?: {
    alternativeText?: string;
    formats?: {
      medium?: {
        url: string;
      };
      small?: {
        url: string;
      };
      thumbnail?: {
        url: string;
      };
    };
    url?: string;
  };
}

export interface BlogAttributes {
  titre: string;
  slug: string;
  description: string;
  date: string;
  auteur: string;
  category: string;
  article: ArticleContent[];
  mignature_image: {
    data: {
      attributes: {
        formats: {
          medium: {
            url: string;
          };
          small?: {
            url: string;
          };
          thumbnail?: {
            url: string;
          };
        };
        url: string;
      };
    };
  };
}

export interface BlogData {
  id: number;
  attributes: BlogAttributes;
}

export interface BlogResponse {
  data: BlogData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleBlogResponse {
  data: BlogData;
}
