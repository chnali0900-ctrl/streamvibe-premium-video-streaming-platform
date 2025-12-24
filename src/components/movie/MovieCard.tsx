import React, { useMemo } from 'react';
import { Star, Play, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { useMovieStore } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
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
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() => setSelectedId(movie.id)}
      className="group relative rounded-xl overflow-hidden bg-zinc-900 shadow-2xl cursor-pointer aspect-poster border border-white/5"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-40"
      />
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
      {/* Tags & Status */}
      <div className="absolute top-3 left-3 flex gap-2">
        {isFav && (
          <div className="bg-red-600/90 backdrop-blur-md p-1.5 rounded-lg shadow-lg">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        )}
      </div>
      <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border-none text-[10px] font-bold h-5 px-2">
        {movie.type.toUpperCase()}
      </Badge>
      {/* Progress Bar for Continue Watching */}
      {historyItem && historyItem.progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
          <Progress value={historyItem.progress} className="h-1 bg-white/20" />
        </div>
      )}
      {/* Hover Information */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className={`text-white font-bold text-base line-clamp-2 leading-tight ${direction === 'rtl' ? 'text-right font-display' : 'text-left'}`}>
              {language === 'fa' && movie.originalTitle ? movie.originalTitle : movie.title}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold">{movie.rating.toFixed(1)}</span>
              </div>
              <span className="text-zinc-400 text-xs font-medium">{movie.releaseYear}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
             <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
             </div>
             <span className="text-xs text-white font-bold uppercase tracking-wider">Play Now</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}