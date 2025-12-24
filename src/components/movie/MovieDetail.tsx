import React, { useState } from 'react';
import { Play, Plus, Check, Star, X, Info, Volume2, Settings, Maximize } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMovieStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { Movie, UserProfile } from '@shared/types';
import { Progress } from '@/components/ui/progress';
export function MovieDetail() {
  const selectedId = useMovieStore(s => s.selectedMovieId);
  const setSelectedId = useMovieStore(s => s.setSelectedMovieId);
  const movies = useMovieStore(s => s.movies);
  const userProfile = useMovieStore(s => s.userProfile);
  const setUserProfile = useMovieStore(s => s.setUserProfile);
  const language = useMovieStore(s => s.language);
  const movie = movies.find(m => m.id === selectedId);
  const isFav = userProfile?.favorites.includes(movie?.id || '');
  const isWatchlist = userProfile?.watchlist.includes(movie?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  if (!movie) return null;
  const handleToggleFav = async () => {
    const res = await api<{ isFavorite: boolean }>('/api/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ movieId: movie.id })
    });
    if (userProfile) {
      const nextFavs = res.isFavorite 
        ? [...userProfile.favorites, movie.id]
        : userProfile.favorites.filter(id => id !== movie.id);
      setUserProfile({ ...userProfile, favorites: nextFavs });
    }
  };
  const t = {
    play: language === 'fa' ? 'پخش' : 'Play',
    cast: language === 'fa' ? 'بازیگران' : 'Cast',
    similar: language === 'fa' ? 'پیشنهادهای مشابه' : 'Recommended',
    addList: language === 'fa' ? 'لیست من' : 'Watchlist'
  };
  return (
    <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-zinc-950 border-zinc-800 outline-none">
        <DialogTitle className="sr-only">{movie.title}</DialogTitle>
        <div className="relative aspect-video w-full bg-black group">
          {isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
               <div className="text-center space-y-4">
                 <Play className="w-16 h-16 mx-auto opacity-20 animate-pulse" />
                 <p className="text-zinc-500">Video Player Mockup (YouTube ID: {movie.trailerUrl})</p>
                 <Button variant="outline" onClick={() => setIsPlaying(false)}>Exit Player</Button>
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent space-y-4">
                 <Progress value={33} className="h-1 bg-zinc-800" />
                 <div className="flex items-center justify-between text-white">
                   <div className="flex items-center gap-4">
                     <Play className="w-5 h-5 fill-current" />
                     <Volume2 className="w-5 h-5" />
                     <span className="text-xs">01:23 / 02:45</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <Settings className="w-5 h-5" />
                     <Maximize className="w-5 h-5" />
                   </div>
                 </div>
               </div>
            </div>
          ) : (
            <>
              <img src={movie.backdropUrl} className="w-full h-full object-cover opacity-60" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full w-20 h-20 bg-red-600 hover:bg-red-700 hover:scale-110 transition-all"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </Button>
              </div>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full bg-black/40 hover:bg-black/60 text-white z-50"
            onClick={() => setSelectedId(null)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-red-500 border-red-500/50">{movie.releaseYear}</Badge>
                <Badge variant="outline" className="text-zinc-400 border-zinc-700">{movie.duration}</Badge>
                <div className="flex items-center gap-1 text-yellow-500 ml-2">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="font-bold">{movie.rating.toFixed(1)}</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white">
                {language === 'fa' && movie.originalTitle ? movie.originalTitle : movie.title}
              </h2>
            </div>
            <p className="text-zinc-400 leading-relaxed text-lg">
              {movie.description}
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 gap-2 font-bold px-8">
                <Play className="w-5 h-5 fill-black" /> {t.play}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-zinc-700 text-white hover:bg-zinc-800 gap-2"
                onClick={handleToggleFav}
              >
                {isFav ? <Check className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5" />}
                {t.addList}
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-wider">{t.cast}</h4>
              <div className="flex flex-wrap gap-2">
                {movie.cast?.map(actor => (
                  <Badge key={actor} variant="secondary" className="bg-zinc-900 text-zinc-300 hover:text-white">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-wider">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <span key={genre} className="text-white text-sm hover:underline cursor-pointer">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}