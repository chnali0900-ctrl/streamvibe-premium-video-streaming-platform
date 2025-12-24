import React, { useEffect, useMemo, useState } from 'react';
import { Search, Clapperboard, User, History, Bookmark, TrendingUp, RotateCcw, AlertCircle } from 'lucide-react';
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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
  const [initError, setInitError] = useState<string | null>(null);
  const init = async () => {
    setInitError(null);
    try {
      const [featured, profile, catalog] = await Promise.allSettled([
        api<Movie>('/api/movies/featured'),
        api<UserProfile>('/api/user/profile'),
        api<{ items: Movie[] }>('/api/movies?limit=100')
      ]);
      if (featured.status === 'fulfilled') setFeaturedMovie(featured.value);
      if (profile.status === 'fulfilled') setUserProfile(profile.value);
      if (catalog.status === 'fulfilled') setAllMovies(catalog.value.items || []);
      // If critical profile/catalog failed, set error
      if (profile.status === 'rejected' || catalog.status === 'rejected') {
        const err = profile.status === 'rejected' ? profile.reason : (catalog as any).reason;
        setInitError(err?.message || "Critical platform data failed to load");
      }
    } catch (err) {
      setInitError(err instanceof Error ? err.message : "System initialization failed");
    }
  };
  useEffect(() => {
    init();
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
    search: language === 'fa' ? 'جستجوی فیلم، سری��ل...' : 'Search titles, actors...',
    results: language === 'fa' ? 'نتایج برای' : 'Results for',
    collection: language === 'fa' ? 'مجموعه' : 'Collection',
    trending: language === 'fa' ? 'برترین‌های امروز' : 'Trending Now',
    myList: language === 'fa' ? 'لی��ت من' : 'My List',
    continue: language === 'fa' ? 'ادامه تماشا' : 'Continue Watching',
    noResults: language === 'fa' ? 'عنوانی یافت نشد' : 'No titles found',
    reset: language === 'fa' ? 'تنظیم مجدد فیلترها' : 'Reset Filters',
    errorTitle: language === 'fa' ? 'خطای سامانه' : 'Platform Connectivity Error',
    errorRetry: language === 'fa' ? 'تلاش مجدد' : 'Retry Connection'
  }), [language]);
  const favoriteMovies = useMemo(() => 
    allMovies.filter(m => userProfile?.favorites.includes(m.id)),
    [allMovies, userProfile?.favorites]
  );
  const historyMovies = useMemo(() => 
    allMovies.filter(m => userProfile?.history.some(h => h.movieId === m.id)),
    [allMovies, userProfile?.history]
  );
  if (initError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6" dir={direction}>
        <Alert variant="destructive" className="max-w-md bg-red-950/20 border-red-900/50">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-xl font-bold mb-2">{t.errorTitle}</AlertTitle>
          <AlertDescription className="space-y-4">
            <p className="text-red-200/80 font-mono text-xs">{initError}</p>
            <Button onClick={() => init()} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
              {t.errorRetry}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-red-600/30" dir={direction}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl transition-all">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-zinc-800 transition-colors" />
              <div className="flex items-center gap-3 mr-auto rtl:mr-0 rtl:ml-auto">
                <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                  <Clapperboard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase hidden sm:block leading-none">{t.brand}</span>
              </div>
              <div className="relative max-w-md w-full hidden md:block">
                <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500`} />
                <Input
                  placeholder={t.search}
                  className={`${direction === 'rtl' ? 'pr-10' : 'pl-10'} bg-zinc-900/50 border-zinc-800 focus:ring-red-600/50 h-11 rounded-xl transition-all hover:bg-zinc-900`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-700 overflow-hidden hover:border-zinc-400 hover:scale-105 transition-all">
                      {userProfile?.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-zinc-950 border-zinc-800 text-white shadow-2xl rounded-xl p-2">
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                      <p className="text-sm font-bold">{userProfile?.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase">Premium Member</p>
                    </div>
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer rounded-lg py-2.5">Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer rounded-lg py-2.5">Subscription</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 text-red-400 cursor-pointer rounded-lg py-2.5">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 pb-20">
            {!searchQuery && activeGenre === 'All' && <HeroSection movie={featuredMovie} />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
              <div className="flex flex-col lg:flex-row gap-12">
                <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 self-start">
                  <FilterSidebar />
                </aside>
                <div className="flex-1 space-y-20">
                  {!searchQuery && activeGenre === 'All' && !isLoading && (
                    <>
                      {historyMovies.length > 0 && (
                        <section className="space-y-8">
                          <div className="flex items-center gap-3">
                            <History className="w-6 h-6 text-red-600" />
                            <h2 className="text-3xl font-black tracking-tight">{t.continue.toUpperCase()}</h2>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-8">
                            {historyMovies.map((movie) => (
                              <MovieCard key={`history-${movie.id}`} movie={movie} />
                            ))}
                          </div>
                        </section>
                      )}
                      {favoriteMovies.length > 0 && (
                        <section className="space-y-8">
                          <div className="flex items-center gap-3">
                            <Bookmark className="w-6 h-6 text-red-600" />
                            <h2 className="text-3xl font-black tracking-tight">{t.myList.toUpperCase()}</h2>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-8">
                            {favoriteMovies.map((movie) => (
                              <MovieCard key={`fav-${movie.id}`} movie={movie} />
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                  <section className="space-y-10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-red-600" />
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
                          {searchQuery ? `${t.results} "${searchQuery}"` : activeGenre !== 'All' ? `${activeGenre} ${t.collection}` : t.trending}
                        </h2>
                      </div>
                      {!isLoading && <span className="text-xs text-zinc-500 font-black tracking-[0.2em] uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{movies.length} TITLES</span>}
                    </div>
                    {isLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="space-y-4">
                            <Skeleton className="aspect-poster w-full rounded-2xl bg-zinc-900/50" />
                            <div className="space-y-2 px-1">
                              <Skeleton className="h-6 w-3/4 bg-zinc-900/50" />
                              <Skeleton className="h-4 w-1/2 bg-zinc-900/50" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : movies.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-8">
                        {movies.map((movie) => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 border border-dashed border-zinc-800 rounded-[2.5rem] bg-zinc-900/10 backdrop-blur-3xl">
                        <div className="h-20 w-20 rounded-3xl bg-zinc-900 flex items-center justify-center border border-white/5 shadow-2xl">
                          <Clapperboard className="w-10 h-10 text-zinc-700" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-2xl font-black text-white uppercase tracking-tight">{t.noResults}</p>
                          <p className="text-zinc-500 max-w-xs mx-auto text-sm font-medium">Try broadening your horizons. Adjust your filters or search query to find your next favorite.</p>
                        </div>
                        <Button variant="outline" onClick={resetFilters} className="gap-2 border-zinc-700 hover:bg-zinc-800 h-12 px-8 rounded-xl font-bold">
                          <RotateCcw className="w-4 h-4" /> {t.reset}
                        </Button>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </main>
          <footer className="border-t border-white/5 py-20 px-8 bg-black/40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <Clapperboard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase leading-none">{t.brand}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
                <a href="#" className="hover:text-red-500 transition-colors">Terms</a>
                <a href="#" className="hover:text-red-500 transition-colors">Cookies</a>
                <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
              </div>
              <p className="text-[10px] text-zinc-600 font-mono font-bold tracking-widest uppercase">© 2025 STREAMVIBE_LABS_GLOBAL</p>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
      <MovieDetail />
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  );
}