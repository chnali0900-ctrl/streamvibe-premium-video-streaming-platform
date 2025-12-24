import { create } from 'zustand';
import { Movie } from '@shared/types';
interface MovieState {
  movies: Movie[];
  featuredMovie: Movie | null;
  isLoading: boolean;
  searchQuery: string;
  activeGenre: string;
  minRating: number;
  contentType: 'all' | 'movie' | 'series';
  setMovies: (movies: Movie[]) => void;
  setFeaturedMovie: (movie: Movie) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setGenre: (genre: string) => void;
  setMinRating: (rating: number) => void;
  setContentType: (type: 'all' | 'movie' | 'series') => void;
}
export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  featuredMovie: null,
  isLoading: false,
  searchQuery: '',
  activeGenre: 'All',
  minRating: 0,
  contentType: 'all',
  setMovies: (movies) => set({ movies }),
  setFeaturedMovie: (movie) => set({ featuredMovie: movie }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setGenre: (activeGenre) => set({ activeGenre }),
  setMinRating: (minRating) => set({ minRating }),
  setContentType: (contentType) => set({ contentType }),
}));