import React, { useEffect } from 'react';
import { Search, Clapperboard, LogIn, User } from 'lucide-react';
import { useMovieStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { HeroSection } from '@/components/movie/HeroSection';
import { MovieCard } from '@/components/movie/MovieCard';
import { FilterSidebar } from '@/components/movie/FilterSidebar';
import { MovieDetail } from '@/components/movie/MovieDetail';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Input } from '@/components/ui/input';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Movie, UserProfile } from '@shared/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export function HomePage() {
  const movies = useMovieStore(s => s.movies);
  const featuredMovie = useMovieStore(s => s.featuredMovie);
  const isLoading = useMovieStore(s => s.isLoading);
  const activeGenre = useMovieStore(s => s.activeGenre);
  const searchQuery = useMovieStore(s => s.searchQuery);
  const minRating = useMovieStore(s => s.minRating);
  const contentType = useMovieStore(s => s.contentType);
  const userProfile = useMovieStore(s => s.userProfile);
  const direction = useMovieStore(s => s.direction);
  const language = useMovieStore(s => s.language);
  const setMovies = useMovieStore(s => s.setMovies);
  const setFeaturedMovie = useMovieStore(s => s.setFeaturedMovie);
  const setLoading = useMovieStore(s => s.setLoading);
  const setSearchQuery = useMovieStore(s => s.setSearchQuery);
  const setUserProfile = useMovieStore(s => s.setUserProfile);
  useEffect(() => {
    const init = async () => {
      try {
        const [featured, profile] = await Promise.all([
          api<Movie>('/api/movies/featured'),
          api<UserProfile>('/api/user/profile')
        ]);
        setFeaturedMovie(featured);
        setUserProfile(profile);
      } catch (err) {
        console.error('Init failed', err);
      }
    };
    init();
  }, [setFeaturedMovie, setUserProfile]);
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          genre: activeGenre,
          search: searchQuery,
          minRating: minRating.toString(),
          type: contentType
        });
        const data = await api<{ items: Movie[] }>(`/api/movies?${params.toString()}`);
        setMovies(data.items);
      } catch (err) {
        console.error('Failed to fetch movies', err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchMovies, 300);
    return () => clearTimeout(timer);
  }, [activeGenre, searchQuery, minRating, contentType, setMovies, setLoading]);
  const t = {
    brand: language === 'fa' ? 'استریم‌ویب' : 'STREAMVIBE',
    search: language === 'fa' ? 'جستجوی فیلم، سریال...' : 'Search titles, actors...',
    results: language === 'fa' ? 'نتایج برای' : 'Results for',
    collection: language === 'fa' ? 'مجموعه' : 'Collection',
    trending: language === 'fa' ? 'برترین‌های امروز' : 'Trending Now'
  };
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-red-600/30 font-sans" dir={direction}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl transition-all duration-300">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex items-center gap-2 mr-auto rtl:mr-0 rtl:ml-auto">
                <Clapperboard className="w-6 h-6 text-red-600" />
                <span className="text-xl font-bold tracking-tighter uppercase">{t.brand}</span>
              </div>
              <div className="relative max-w-md w-full hidden md:block">
                <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500`} />
                <Input
                  placeholder={t.search}
                  className={`${direction === 'rtl' ? 'pr-10' : 'pl-10'} bg-zinc-900/50 border-zinc-800 focus:ring-red-600/50`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-700 overflow-hidden">
                      {userProfile?.avatarUrl ? <img src={userProfile.avatarUrl} alt="User" /> : <User className="w-4 h-4" />}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-white">
                    <DropdownMenuItem className="focus:bg-zinc-800">My Favorites</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800">Watchlist</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800">Settings</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 text-red-400">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden">
            <HeroSection movie={featuredMovie} />
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 flex gap-10">
              <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 self-start">
                <FilterSidebar />
              </aside>
              <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {searchQuery ? `${t.results} "${searchQuery}"` : activeGenre !== 'All' ? `${activeGenre} ${t.collection}` : t.trending}
                  </h2>
                  <span className="text-sm text-zinc-500 font-medium">{movies.length} titles</span>
                </div>
                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="aspect-[2/3] bg-zinc-900 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : movies.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-zinc-500 space-y-4">
                    <Clapperboard className="w-16 h-16 opacity-20" />
                    <p className="text-lg">No titles found.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
          <footer className="border-t border-white/5 py-12 px-12 mt-12 bg-zinc-950/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-red-600" />
                <span className="text-lg font-bold tracking-tighter uppercase">{t.brand}</span>
              </div>
              <p className="text-xs text-zinc-600">© 2024 {t.brand} Entertainment Inc.</p>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
      <MovieDetail />
      <Toaster richColors closeButton />
    </div>
  );
}