export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  status: 'draft' | 'published';
}

export interface Comment {
  id: number;
  text: string;
  articleId: number;
  userId: number;
  createdAt: Date;
}

export interface CreateArticleInput {
  title: string;
  content: string;
}

export interface UpdateArticleInput {
  id: number;
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
}

export interface CreateCommentInput {
  text: string;
}
