export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type ContentType = 'movie' | 'series';
export interface Genre {
  id: string;
  name: string;
}
export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  rating: number; // IMDB 1-10
  genres: string[];
  type: ContentType;
  duration?: string;
  isFeatured?: boolean;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}