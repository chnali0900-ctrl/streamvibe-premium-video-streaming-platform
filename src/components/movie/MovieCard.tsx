import React, { useMemo } from 'react';
import { Star, Play, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { useMovieStore } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
interface MovieCardProps {
  movie: Movie;
}
export function MovieCard({ movie }: MovieCardProps) {
  const setSelectedId = useMovieStore(s => s.setSelectedMovieId);
  const userProfile = useMovieStore(s => s.userProfile);
  const language = useMovieStore(s => s.language);
  const direction = useMovieStore(s => s.direction);
  const isFav = useMemo(() => userProfile?.favorites.includes(movie.id), [userProfile?.favorites, movie.id]);
  const historyItem = useMemo(() => userProfile?.history.find(h => h.movieId === movie.id), [userProfile?.history, movie.id]);
  const isTrending = movie.rating > 8.5;
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => setSelectedId(movie.id)}
      className="group relative rounded-xl overflow-hidden bg-zinc-900 shadow-2xl cursor-pointer aspect-poster border border-white/5 ring-primary/0 hover:ring-2 hover:ring-primary/50 transition-all duration-300"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-30"
      />
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      {/* Tags & Status */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {isFav && (
          <div className="bg-red-600/90 backdrop-blur-md p-1.5 rounded-lg shadow-lg">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        )}
        {isTrending && (
          <Badge className="bg-amber-500/90 hover:bg-amber-500 border-none text-[10px] h-5 px-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> TRENDING
          </Badge>
        )}
      </div>
      <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border-none text-[10px] font-bold h-5 px-2">
        {movie.type.toUpperCase()}
      </Badge>
      {/* Progress Bar for Continue Watching */}
      {historyItem && historyItem.progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
          <Progress 
            value={historyItem.progress} 
            className="h-1.5 bg-white/10 [&>div]:bg-red-600 [&>div]:animate-pulse" 
          />
        </div>
      )}
      {/* Hover Information */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h3 className={cn(
              "text-white font-bold text-lg line-clamp-2 leading-tight drop-shadow-md",
              direction === 'rtl' ? 'text-right font-display' : 'text-left'
            )}>
              {language === 'fa' && movie.originalTitle ? movie.originalTitle : movie.title}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-black">{movie.rating.toFixed(1)}</span>
              </div>
              <span className="text-zinc-300 text-xs font-semibold">{movie.releaseYear}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
             <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 hover:scale-110 active:scale-95 transition-transform">
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
             </div>
             <span className="text-[10px] text-white font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded backdrop-blur-sm">Play Now</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}