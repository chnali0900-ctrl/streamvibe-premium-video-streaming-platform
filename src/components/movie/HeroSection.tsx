import React from 'react';
import { Play, Info, Star, Flame } from 'lucide-react';
import { Movie } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
interface HeroSectionProps {
  movie: Movie | null;
}
export function HeroSection({ movie }: HeroSectionProps) {
  if (!movie) return <div className="h-[70vh] bg-zinc-900 animate-pulse" />;
  return (
    <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
      {/* Immersive Cinematic Background */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Multidirectional Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10 backdrop-brightness-75" />
      </div>
      {/* Floating Content Elements */}
      <div className="relative h-full flex flex-col justify-end pb-16 md:pb-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 md:space-y-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <Badge className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1 font-bold tracking-wider">
              <Flame className="w-3 h-3 mr-1 fill-white" /> EXCLUSIVE PREMIERE
            </Badge>
            <div className="flex items-center gap-1 text-yellow-400 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="text-sm font-black">{movie.rating} IMDB</span>
            </div>
            <span className="text-zinc-300 font-medium text-sm hidden sm:block">• {movie.releaseYear} • {movie.genres[0]} • {movie.type.toUpperCase()}</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter max-w-4xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-[0.9]">
            {movie.title.toUpperCase()}
          </h1>
          <p className="text-zinc-200 text-base md:text-xl max-w-2xl line-clamp-3 md:line-clamp-none drop-shadow-md font-medium leading-relaxed">
            {movie.description}
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-3 px-10 h-14 text-lg font-black shadow-xl shadow-red-600/20 active:scale-95 transition-all">
              <Play className="w-6 h-6 fill-white" /> PLAY NOW
            </Button>
            <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/15 text-white gap-3 px-10 h-14 text-lg font-bold active:scale-95 transition-all">
              <Info className="w-6 h-6" /> DETAILS
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}