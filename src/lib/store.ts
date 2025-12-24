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
  isSidebarOpen: boolean;
  // Actions
  setMovies: (movies: Movie[]) => void;
  setFeaturedMovie: (movie: Movie | null) => void;
  setSelectedMovieId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setGenre: (genre: string) => void;
  setMinRating: (rating: number) => void;
  setContentType: (type: 'all' | 'movie' | 'series') => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
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
  isSidebarOpen: true,
  setMovies: (movies) => set({ movies }),
  setFeaturedMovie: (featuredMovie) => set({ featuredMovie }),
  setSelectedMovieId: (selectedMovieId) => set({ selectedMovieId }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setGenre: (activeGenre) => set({ activeGenre }),
  setMinRating: (minRating) => set({ minRating }),
  setContentType: (contentType) => set({ contentType }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setLanguage: (language) => {
    const direction = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    set({ language, direction });
  },
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
}));