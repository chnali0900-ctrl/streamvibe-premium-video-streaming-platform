import React, { useEffect } from 'react';
import { Search, Clapperboard, User, History, Bookmark, TrendingUp } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
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
  // Initialize data
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const [featured, profile] = await Promise.all([
          api<Movie>('/api/movies/featured'),
          api<UserProfile>('/api/user/profile')
        ]);
        if (mounted) {
          setFeaturedMovie(featured);
          setUserProfile(profile);
        }
      } catch (err) {
        console.error('Init failed', err);
      }
    };
    init();
    return () => { mounted = false; };
  }, [setFeaturedMovie, setUserProfile]);
  // Handle filtered movie fetching
  useEffect(() => {
    let mounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          genre: activeGenre,
          search: searchQuery,
          minRating: minRating.toString(),
          type: contentType,
          limit: '20'
        });
        const data = await api<{ items: Movie[] }>(`/api/movies?${params.toString()}`);
        if (mounted) {
          setMovies(data.items || []);
        }
      } catch (err) {
        console.error('Failed to fetch movies', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    const timer = setTimeout(fetchMovies, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [activeGenre, searchQuery, minRating, contentType, setMovies, setLoading]);
  const t = {
    brand: language === 'fa' ? 'استری��‌ویب' : 'STREAMVIBE',
    search: language === 'fa' ? 'جستجوی فیلم، سریال...' : 'Search titles, actors...',
    results: language === 'fa' ? 'نت��یج برای' : 'Results for',
    collection: language === 'fa' ? 'مجموعه' : 'Collection',
    trending: language === 'fa' ? 'برترین‌های امرو��' : 'Trending Now',
    myList: language === 'fa' ? 'لیست من' : 'My List',
    continue: language === 'fa' ? 'ادامه تماشا' : 'Continue Watching'
  };
  const favoriteMovies = movies.filter(m => userProfile?.favorites.includes(m.id));
  const historyMovies = movies.filter(m => userProfile?.history.some(h => h.movieId === m.id));
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
                  className={`${direction === 'rtl' ? 'pr-10' : 'pl-10'} bg-zinc-900/50 border-zinc-800 focus:ring-red-600/50 h-10`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-700 overflow-hidden ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {userProfile?.avatarUrl ? <img src={userProfile.avatarUrl} alt="User" /> : <User className="w-4 h-4" />}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-white shadow-2xl">
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">My Favorites</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">Watchlist</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer border-t border-zinc-800 mt-1">Settings</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 text-red-400 cursor-pointer">Logout</DropdownMenuItem>
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
              <div className="flex-1 space-y-12">
                {/* Personalized Rows (Visible only when no active filter/search) */}
                {!searchQuery && activeGenre === 'All' && !isLoading && (
                  <>
                    {historyMovies.length > 0 && (
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <History className="w-5 h-5 text-red-600" />
                          <h2 className="text-xl font-bold tracking-tight">{t.continue}</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {historyMovies.map((movie) => (
                            <MovieCard key={`history-${movie.id}`} movie={movie} />
                          ))}
                        </div>
                      </section>
                    )}
                    {favoriteMovies.length > 0 && (
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-5 h-5 text-red-600" />
                          <h2 className="text-xl font-bold tracking-tight">{t.myList}</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {favoriteMovies.map((movie) => (
                            <MovieCard key={`fav-${movie.id}`} movie={movie} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}
                {/* Main Discovery Grid */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        {searchQuery ? `${t.results} "${searchQuery}"` : activeGenre !== 'All' ? `${activeGenre} ${t.collection}` : t.trending}
                      </h2>
                    </div>
                    {!isLoading && <span className="text-sm text-zinc-500 font-medium">{movies.length} titles</span>}
                  </div>
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="aspect-[2/3] w-full rounded-lg bg-zinc-900" />
                          <Skeleton className="h-4 w-3/4 bg-zinc-900" />
                          <Skeleton className="h-3 w-1/2 bg-zinc-900" />
                        </div>
                      ))}
                    </div>
                  ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-zinc-500 space-y-4 border border-dashed border-zinc-800 rounded-xl">
                      <Clapperboard className="w-16 h-16 opacity-10" />
                      <p className="text-lg font-medium">No titles found.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); }}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Clear search and filters
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>
          <footer className="border-t border-white/5 py-12 px-12 mt-12 bg-zinc-950/80">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-red-600" />
                <span className="text-lg font-bold tracking-tighter uppercase">{t.brand}</span>
              </div>
              <div className="flex gap-6 text-xs text-zinc-500">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </div>
              <p className="text-xs text-zinc-600">© 2025 {t.brand} Entertainment Inc.</p>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
      <MovieDetail />
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  );
}