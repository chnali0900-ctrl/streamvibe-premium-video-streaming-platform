import React from "react";
import { Home, Clapperboard, MonitorPlay, Bookmark, Search, TrendingUp, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useMovieStore } from "@/lib/store";
const GENRES = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Adventure', 'Fantasy', 'Mystery', 'Romance', 'Comedy', 'Drama'];
export function AppSidebar(): JSX.Element {
  const language = useMovieStore(s => s.language);
  const direction = useMovieStore(s => s.direction);
  const activeGenre = useMovieStore(s => s.activeGenre);
  const contentType = useMovieStore(s => s.contentType);
  const searchQuery = useMovieStore(s => s.searchQuery);
  const setGenre = useMovieStore(s => s.setGenre);
  const setContentType = useMovieStore(s => s.setContentType);
  const setSearchQuery = useMovieStore(s => s.setSearchQuery);
  const resetFilters = useMovieStore(s => s.resetFilters);
  const t = {
    browse: language === 'fa' ? 'مرور' : 'Browse',
    movies: language === 'fa' ? 'فیلم‌ها' : 'Movies',
    series: language === 'fa' ? 'سریال‌ها' : 'Series',
    myList: language === 'fa' ? 'لیست من' : 'My List',
    genres: language === 'fa' ? 'ژانرها' : 'Genres',
    search: language === 'fa' ? 'جستجو...' : 'Search...',
    all: language === 'fa' ? 'همه' : 'All'
  };
  return (
    <Sidebar side={direction === 'rtl' ? 'right' : 'left'}>
      <SidebarHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
            <Clapperboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">StreamVibe</span>
        </div>
        <div className="px-3 mt-2">
          <div className="relative">
            <Search className={`absolute ${direction === 'rtl' ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500`} />
            <SidebarInput 
              placeholder={t.search} 
              className={`${direction === 'rtl' ? 'pr-9' : 'pl-9'} bg-zinc-900 border-zinc-800 text-sm`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500">{t.browse}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={contentType === 'all' && activeGenre === 'All' && !searchQuery}
                onClick={resetFilters}
              >
                <Home className="size-4" /> <span>{t.all}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={contentType === 'movie'}
                onClick={() => setContentType('movie')}
              >
                <Clapperboard className="size-4" /> <span>{t.movies}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={contentType === 'series'}
                onClick={() => setContentType('series')}
              >
                <MonitorPlay className="size-4" /> <span>{t.series}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500">{t.genres}</SidebarGroupLabel>
          <SidebarMenu>
            {GENRES.map((genre) => (
              <SidebarMenuItem key={genre}>
                <SidebarMenuButton 
                  isActive={activeGenre === genre}
                  onClick={() => setGenre(genre)}
                  className="flex items-center gap-2"
                >
                  {genre === 'All' ? <Sparkles className="size-4" /> : <div className="size-1 rounded-full bg-zinc-700 group-hover:bg-red-500" />}
                  <span>{genre}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 py-4 px-4">
        <div className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">Premium Content Archive</div>
      </SidebarFooter>
    </Sidebar>
  );
}