import React from 'react';
import { Star, Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
interface MovieCardProps {
  movie: Movie;
}
export function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="group relative rounded-lg overflow-hidden bg-zinc-900 shadow-lg cursor-pointer aspect-[2/3]"
    >
      <img 
        src={movie.posterUrl} 
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:opacity-40"
      />
      {/* Overlay info */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold truncate text-sm sm:text-base">{movie.title}</h3>
            <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-white">{movie.rating}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map(g => (
              <Badge key={g} variant="secondary" className="bg-zinc-800 text-[10px] h-5 px-1.5">
                {g}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="icon" className="w-8 h-8 rounded-full bg-white text-black hover:bg-zinc-200">
              <Play className="w-4 h-4 fill-black" />
            </Button>
            <Button size="icon" variant="outline" className="w-8 h-8 rounded-full border-zinc-500 text-white">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Type badge (static) */}
      <Badge className="absolute top-2 right-2 bg-red-600/80 backdrop-blur-sm uppercase text-[10px] border-none">
        {movie.type}
      </Badge>
    </motion.div>
  );
}