import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Play, Plus, Check, Star, X, Info, Volume2, Settings, Maximize, Share2, Download, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMovieStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { Movie } from '@shared/types';
import { Progress } from '@/components/ui/progress';
import { MovieCard } from './MovieCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function MovieDetail() {
  const selectedId = useMovieStore(s => s.selectedMovieId);
  const setSelectedId = useMovieStore(s => s.setSelectedMovieId);
  const allMovies = useMovieStore(s => s.allMovies);
  const userProfile = useMovieStore(s => s.userProfile);
  const setUserProfile = useMovieStore(s => s.setUserProfile);
  const language = useMovieStore(s => s.language);
  const direction = useMovieStore(s => s.direction);
  const movie = allMovies.find(m => m.id === selectedId);
  const isFav = userProfile?.favorites.includes(movie?.id || '');
  const inWatchlist = userProfile?.watchlist.includes(movie?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const downloadIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const recommendations = useMemo(() => {
    if (!movie) return [];
    return allMovies
      .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
      .slice(0, 12);
  }, [movie, allMovies]);

  const handleToggleFav = async () => {
    if (!movie) return;
    try {
      const res = await api<{ isFavorite: boolean }>('/api/user/favorites', {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id })
      });
      if (userProfile) {
        const nextFavs = res.isFavorite
          ? [...userProfile.favorites, movie.id]
          : userProfile.favorites.filter(id => id !== movie.id);
        setUserProfile({ ...userProfile, favorites: nextFavs });
        toast.success(res.isFavorite ? 'Added to My List' : 'Removed from My List');
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!movie) return;
    try {
      const res = await api<{ inWatchlist: boolean }>('/api/user/watchlist', {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id })
      });
      if (userProfile) {
        const nextWatchlist = res.inWatchlist
          ? [...userProfile.watchlist, movie.id]
          : userProfile.watchlist.filter(id => id !== movie.id);
        setUserProfile({ ...userProfile, watchlist: nextWatchlist });
        toast.success(res.inWatchlist ? 'Added to Watchlist' : 'Removed from Watchlist');
      }
    } catch (err) {
      console.error("Failed to toggle watchlist", err);
    }
  };

  const handleDownload = () => {
    if (isDownloading || isDownloaded) return;
    setIsDownloading(true);
    toast.info("Starting download in 4K HDR...");
    let progress = 0;
    downloadIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        if (downloadIntervalRef.current) {
          clearInterval(downloadIntervalRef.current);
          downloadIntervalRef.current = null;
        }
        setIsDownloading(false);
        setIsDownloaded(true);
        toast.success("Download complete: Enjoy offline viewing!");
      }
      setDownloadProgress(progress);
    }, 600);
  };

  if (!movie) return null;

  const t = {
    play: language === 'fa' ? 'پخش' : 'Play',
    cast: language === 'fa' ? 'بازیگران' : 'Cast',
    recommended: language === 'fa' ? 'عناوین مشابه' : 'You May Also Like',
    myList: language === 'fa' ? 'لیست من' : 'My List',
    download: language === 'fa' ? 'بارگذاری' : 'Download',
    downloaded: language === 'fa' ? 'بارگذاری شده' : 'Downloaded',
    watchlist: language === 'fa' ? 'دیدنی‌ها' : 'Watchlist'
  };

  return (
    <Dialog open={!!selectedId} onOpenChange={(open) => {
      if (!open) {
        setSelectedId(null);
        setIsPlaying(false);
        if (downloadIntervalRef.current) {
          clearInterval(downloadIntervalRef.current);
          downloadIntervalRef.current = null;
        }
      }
    }}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-zinc-950 border-zinc-800 outline-none max-h-[92vh] flex flex-col">
        <DialogTitle className="sr-only">{movie.title}</DialogTitle>
        <DialogDescription id="movie-detail-desc" className="sr-only">{movie.title} - Movie and TV show details</DialogDescription>
        <ScrollArea className="flex-1">
          <div className="relative aspect-video w-full bg-black group">
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="player"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black"
                >
                   <div className="text-center space-y-4">
                     <Play className="w-16 h-16 mx-auto opacity-20 animate-pulse text-red-600" />
                     <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Initializing Secure Stream (ID: {movie.trailerUrl})</p>
                     <Button variant="outline" size="sm" onClick={() => setIsPlaying(false)} className="border-white/10 hover:bg-white/5">Exit Player</Button>
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent space-y-4">
                     <Progress value={33} className="h-1 bg-zinc-800 [&>div]:bg-red-600" />
                     <div className="flex items-center justify-between text-white">
                       <div className="flex items-center gap-6">
                         <Play className="w-5 h-5 fill-current cursor-pointer hover:text-red-500 transition-colors" />
                         <Volume2 className="w-5 h-5 cursor-pointer" />
                         <span className="text-xs font-mono tracking-tighter">00:45:12 / 02:24:00</span>
                       </div>
                       <div className="flex items-center gap-6">
                         <Settings className="w-5 h-5 cursor-pointer" />
                         <Maximize className="w-5 h-5 cursor-pointer" />
                       </div>
                     </div>
                   </div>
                </motion.div>
              ) : (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full"
                >
                  <img src={movie.backdropUrl} className="w-full h-full object-cover opacity-60" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="rounded-full w-24 h-24 bg-red-600 hover:bg-red-700 hover:scale-110 shadow-2xl shadow-red-600/40 transition-all active:scale-90"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Play className="w-10 h-10 fill-white ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-black/40 hover:bg-black/80 text-white z-50 backdrop-blur-md"
              onClick={() => setSelectedId(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-8 md:p-12 space-y-12" dir={direction}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge variant="outline" className="text-red-500 border-red-500/50 bg-red-500/5 px-3 py-1 font-black">{movie.releaseYear}</Badge>
                    <Badge variant="outline" className="text-zinc-400 border-zinc-800 bg-white/5 px-3 py-1">{movie.duration}</Badge>
                    <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/5 border border-yellow-500/20 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="font-black text-sm">{movie.rating.toFixed(1)} Rating</span>
                    </div>
                    <Badge className="bg-zinc-800 text-zinc-300">Ultra HD 4K</Badge>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight">
                    {language === 'fa' && movie.originalTitle ? movie.originalTitle : movie.title}
                  </h2>
                </div>
                <p className="text-zinc-400 leading-relaxed text-lg font-medium max-w-3xl">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="bg-white text-black hover:bg-zinc-200 gap-3 font-black px-12 h-14 rounded-xl" onClick={() => setIsPlaying(true)}>
                    <Play className="w-6 h-6 fill-black" /> {t.play.toUpperCase()}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "border-white/10 text-white gap-3 px-8 h-14 rounded-xl backdrop-blur-md relative overflow-hidden transition-all",
                      isDownloading ? "border-red-600/50" : "hover:bg-white/5"
                    )}
                    onClick={handleDownload}
                  >
                    {isDownloading ? (
                      <>
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                        <span className="animate-pulse">DOWNLOADING {Math.round(downloadProgress)}%</span>
                      </>
                    ) : isDownloaded ? (
                      <><CheckCircle2 className="w-6 h-6 text-green-500" /> {t.downloaded.toUpperCase()}</>
                    ) : (
                      <><Download className="w-6 h-6" /> {t.download.toUpperCase()}</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/10 text-white hover:bg-white/5 gap-3 px-8 h-14 rounded-xl backdrop-blur-md"
                    onClick={handleToggleWatchlist}
                  >
                    {inWatchlist ? <Check className="w-6 h-6 text-red-500" /> : <Plus className="w-6 h-6" />}
                    {t.watchlist.toUpperCase()}
                  </Button>
                </div>
              </div>
              <div className="space-y-8 bg-white/5 p-6 rounded-2xl border border-white/5 h-fit">
                <div className="space-y-4">
                   <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 hover:bg-white/10 text-zinc-400 hover:text-white transition-all h-12 rounded-xl"
                    onClick={handleToggleFav}
                   >
                     {isFav ? <Check className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5" />}
                     <span className="font-bold">{t.myList}</span>
                   </Button>
                   <Button variant="ghost" className="w-full justify-start gap-4 hover:bg-white/10 text-zinc-400 hover:text-white transition-all h-12 rounded-xl">
                     <Share2 className="w-5 h-5" />
                     <span className="font-bold">Share Title</span>
                   </Button>
                </div>
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{t.cast}</h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {movie.cast?.map(actor => (
                      <Badge key={actor} variant="secondary" className="bg-zinc-900/50 text-zinc-300 border border-white/5 hover:text-white hover:bg-zinc-800">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Genres</h4>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {movie.genres.map(genre => (
                      <span key={genre} className="text-white text-sm font-bold hover:text-red-500 cursor-pointer transition-colors underline decoration-white/10 underline-offset-4">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    <span>Director</span>
                    <span className="text-zinc-300">Christopher Nolan</span>
                  </div>
                </div>
              </div>
            </div>
            {recommendations.length > 0 && (
              <div className="space-y-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white tracking-tight">{t.recommended.toUpperCase()}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {recommendations.map(m => (
                    <MovieCard key={`rec-${m.id}`} movie={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
//