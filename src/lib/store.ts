import { create } from 'zustand';
import { Movie, UserProfile, Language, Direction } from '@shared/types';
interface MovieState {
  movies: Movie[];
  featuredMovie: Movie | null;
  selectedMovieId: string | null;
  isLoading: boolean;
  searchQuery: string;
  activeGenre: string;
  minRating: number;
  contentType: 'all' | 'movie' | 'series';
  // User Profile
  userProfile: UserProfile | null;
  language: Language;
  direction: Direction;
  // Actions
  setMovies: (movies: Movie[]) => void;
  setFeaturedMovie: (movie: Movie) => void;
  setSelectedMovieId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setGenre: (genre: string) => void;
  setMinRating: (rating: number) => void;
  setContentType: (type: 'all' | 'movie' | 'series') => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLanguage: (lang: Language) => void;
}
export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  featuredMovie: null,
  selectedMovieId: null,
  isLoading: false,
  searchQuery: '',
  activeGenre: 'All',
  minRating: 0,
  contentType: 'all',
  userProfile: null,
  language: 'en',
  direction: 'ltr',
  setMovies: (movies) => set({ movies }),
  setFeaturedMovie: (movie) => set({ featuredMovie: movie }),
  setSelectedMovieId: (selectedMovieId) => set({ selectedMovieId }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setGenre: (activeGenre) => set({ activeGenre }),
  setMinRating: (minRating) => set({ minRating }),
  setContentType: (contentType) => set({ contentType }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setLanguage: (language) => set({ 
    language, 
    direction: language === 'fa' ? 'rtl' : 'ltr' 
  }),
}));