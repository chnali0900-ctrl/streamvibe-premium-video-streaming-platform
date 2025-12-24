export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type ContentType = 'movie' | 'series';
export type Language = 'en' | 'fa';
export type Direction = 'ltr' | 'rtl';
export interface Genre {
  id: string;
  name: string;
}
export interface UserHistoryItem {
  movieId: string;
  progress: number; // 0-100
  watchedAt: number; // timestamp
}
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  favorites: string[]; // array of movie IDs
  watchlist: string[]; // array of movie IDs
  history: UserHistoryItem[];
  preferredLanguage: Language;
}
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string; // e.g. Persian title
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  rating: number; // IMDB 1-10
  genres: string[];
  type: ContentType;
  duration?: string;
  isFeatured?: boolean;
  trailerUrl?: string; // YouTube ID
  cast?: string[];
}
export interface User {
  id: string;
  name: string;
}