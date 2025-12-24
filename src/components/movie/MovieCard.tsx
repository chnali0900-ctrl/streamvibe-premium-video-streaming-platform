import React from 'react';
import { Star, Play, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { useMovieStore } from '@/lib/store';
interface MovieCardProps {
  movie: Movie;
}
export function MovieCard({ movie }: MovieCardProps) {
  const setSelectedId = useMovieStore(s => s.setSelectedMovieId);
  const userProfile = useMovieStore(s => s.userProfile);
  const language = useMovieStore(s => s.language);
  const direction = useMovieStore(s => s.direction);
  const isFav = userProfile?.favorites.includes(movie.id);
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => setSelectedId(movie.id)}
      className="group relative rounded-lg overflow-hidden bg-zinc-900 shadow-lg cursor-pointer aspect-[2/3]"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:opacity-30"
      />
      {/* Selection State Visuals */}
      {isFav && (
        <div className="absolute top-2 left-2 z-10">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
      )}
      {/* Hover Information */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-white font-bold truncate text-sm sm:text-base ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              {language === 'fa' && movie.originalTitle ? movie.originalTitle : movie.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-500/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-500">{movie.rating.toFixed(1)}</span>
            </div>
            <span className="text-zinc-400 text-[10px]">{movie.releaseYear}</span>
          </div>
          <div className="flex gap-2 pt-1">
             <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40">
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
             </div>
          </div>
        </div>
      </div>
      <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-md uppercase text-[9px] border-none font-bold py-0 h-4">
        {movie.type}
      </Badge>
    </motion.div>
  );
}