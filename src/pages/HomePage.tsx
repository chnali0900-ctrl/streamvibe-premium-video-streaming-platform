import React, { useEffect, useMemo } from 'react';
import { Search, Clapperboard, User, History, Bookmark, TrendingUp, RotateCcw } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
export function HomePage() {
  const movies = useMovieStore(s => s.movies);
  const allMovies = useMovieStore(s => s.allMovies);
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
  const setAllMovies = useMovieStore(s => s.setAllMovies);
  const setFeaturedMovie = useMovieStore(s => s.setFeaturedMovie);
  const setLoading = useMovieStore(s => s.setLoading);
  const setSearchQuery = useMovieStore(s => s.setSearchQuery);
  const setUserProfile = useMovieStore(s => s.setUserProfile);
  const resetFilters = useMovieStore(s => s.resetFilters);
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const [featured, profile, catalog] = await Promise.allSettled([
          api<Movie>('/api/movies/featured'),
          api<UserProfile>('/api/user/profile'),
          api<{ items: Movie[] }>('/api/movies?limit=100')
        ]);
        if (!mounted) return;
        if (featured.status === 'fulfilled') setFeaturedMovie(featured.value);
        if (profile.status === 'fulfilled') setUserProfile(profile.value);
        if (catalog.status === 'fulfilled') setAllMovies(catalog.value.items || []);
      } catch (err) {
        console.error('Core init failed', err);
      }
    };
    init();
    return () => { mounted = false; };
  }, [setFeaturedMovie, setUserProfile, setAllMovies]);
  useEffect(() => {
    let mounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeGenre && activeGenre !== 'All') params.append('genre', activeGenre);
        if (searchQuery) params.append('search', searchQuery);
        if (minRating > 0) params.append('minRating', minRating.toString());
        if (contentType && contentType !== 'all') params.append('type', contentType);
        params.append('limit', '40');
        const data = await api<{ items: Movie[] }>(`/api/movies?${params.toString()}`);
        if (mounted) setMovies(data.items || []);
      } catch (err) {
        console.error('Discovery fetch failed', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    const timer = setTimeout(fetchMovies, 400);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [activeGenre, searchQuery, minRating, contentType, setMovies, setLoading]);
  const t = useMemo(() => ({
    brand: language === 'fa' ? 'استریم‌ویب' : 'STREAMVIBE',
    search: language === 'fa' ? 'جستجوی فیلم، سریال...' : 'Search titles, actors...',
    results: language === 'fa' ? 'نتایج برای' : 'Results for',
    collection: language === 'fa' ? 'مجموعه' : 'Collection',
    trending: language === 'fa' ? 'برترین‌های امروز' : 'Trending Now',
    myList: language === 'fa' ? 'لیست من' : 'My List',
    continue: language === 'fa' ? 'ادامه تماشا' : 'Continue Watching',
    noResults: language === 'fa' ? 'عنوانی یافت نشد' : 'No titles found',
    reset: language === 'fa' ? 'تنظیم مجدد فیلترها' : 'Reset Filters'
  }), [language]);
  const favoriteMovies = useMemo(() =>
    allMovies.filter(m => userProfile?.favorites.includes(m.id)),
    [allMovies, userProfile?.favorites]
  );
  const historyMovies = useMemo(() =>
    allMovies.filter(m => userProfile?.history.some(h => h.movieId === m.id)),
    [allMovies, userProfile?.history]
  );
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-red-600/30" dir={direction}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl transition-all">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-zinc-800 transition-colors" />
              <div className="flex items-center gap-2 mr-auto rtl:mr-0 rtl:ml-auto">
                <Clapperboard className="w-6 h-6 text-red-600" />
                <span className="text-xl font-bold tracking-tighter uppercase hidden sm:block">{t.brand}</span>
              </div>
              <div className="relative max-w-md w-full hidden md:block">
                <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500`} />
                <Input
                  placeholder={t.search}
                  className={`${direction === 'rtl' ? 'pr-10' : 'pl-10'} bg-zinc-900 border-zinc-800 focus:ring-red-600/50 h-10`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-700 overflow-hidden hover:border-zinc-500 transition-colors">
                      {userProfile?.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-white shadow-2xl">
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">Subscription</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 text-red-400 cursor-pointer">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {!searchQuery && activeGenre === 'All' && <HeroSection movie={featuredMovie} />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
              <div className="flex flex-col lg:flex-row gap-10">
                <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 self-start">
                  <FilterSidebar />
                </aside>
                <div className="flex-1 space-y-16">
                  {!searchQuery && activeGenre === 'All' && !isLoading && (
                    <>
                      {historyMovies.length > 0 && (
                        <section className="space-y-6">
                          <div className="flex items-center gap-2">
                            <History className="w-5 h-5 text-red-600" />
                            <h2 className="text-2xl font-bold tracking-tight">{t.continue}</h2>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                            {historyMovies.map((movie) => (
                              <MovieCard key={`history-${movie.id}`} movie={movie} />
                            ))}
                          </div>
                        </section>
                      )}
                      {favoriteMovies.length > 0 && (
                        <section className="space-y-6">
                          <div className="flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-red-600" />
                            <h2 className="text-2xl font-bold tracking-tight">{t.myList}</h2>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favoriteMovies.map((movie) => (
                              <MovieCard key={`fav-${movie.id}`} movie={movie} />
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                  <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-600" />
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                          {searchQuery ? `${t.results} "${searchQuery}"` : activeGenre !== 'All' ? `${activeGenre} ${t.collection}` : t.trending}
                        </h2>
                      </div>
                      {!isLoading && <span className="text-sm text-zinc-500 font-medium">{movies.length} titles</span>}
                    </div>
                    {isLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="aspect-poster w-full rounded-xl bg-zinc-900" />
                            <Skeleton className="h-5 w-3/4 bg-zinc-900" />
                            <Skeleton className="h-4 w-1/2 bg-zinc-900" />
                          </div>
                        ))}
                      </div>
                    ) : movies.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                        {movies.map((movie) => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
                        <Clapperboard className="w-16 h-16 text-zinc-800" />
                        <div className="space-y-2">
                          <p className="text-xl font-bold text-zinc-300">{t.noResults}</p>
                          <p className="text-zinc-500 max-w-xs mx-auto text-sm">Try adjusting your filters or search query to find what you're looking for.</p>
                        </div>
                        <Button variant="outline" onClick={resetFilters} className="gap-2 border-zinc-700 hover:bg-zinc-800">
                          <RotateCcw className="w-4 h-4" /> {t.reset}
                        </Button>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </main>
          <footer className="border-t border-white/5 py-16 px-8 mt-20 bg-black/40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-6 h-6 text-red-600" />
                <span className="text-xl font-bold tracking-tighter uppercase">{t.brand}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-xs font-medium text-zinc-500 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
              <p className="text-xs text-zinc-600 font-mono">© 2025 STREAMVIBE_LABS</p>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
      <MovieDetail />
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  );
}