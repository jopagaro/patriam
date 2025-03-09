export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  author?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'writer' | 'reader';
  createdAt: Date;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  text: string;
  createdAt: Date;
  user?: User;
}

export interface MediaUpload {
  id: string;
  url: string;
  type: 'image' | 'graph';
  articleId?: string;
  userId: string;
  createdAt: Date;
}
