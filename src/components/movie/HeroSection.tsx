import React from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Movie } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface HeroSectionProps {
  movie: Movie | null;
}
export function HeroSection({ movie }: HeroSectionProps) {
  if (!movie) return <div className="h-[70vh] bg-zinc-900 animate-pulse" />;
  return (
    <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
      {/* Background with Vignette */}
      <div className="absolute inset-0">
        <img 
          src={movie.backdropUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
      </div>
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-12 md:pb-20 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 animate-fade-in">
          <Badge className="bg-red-600 hover:bg-red-700">NEW RELEASE</Badge>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="text-sm font-bold">{movie.rating} Rating</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-3xl drop-shadow-2xl">
          {movie.title}
        </h1>
        <p className="text-zinc-200 text-base md:text-lg max-w-xl line-clamp-3 md:line-clamp-none drop-shadow-lg">
          {movie.description}
        </p>
        <div className="flex items-center gap-4">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2 px-8 h-12 text-base font-semibold">
            <Play className="w-5 h-5 fill-white" /> Play Now
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white gap-2 px-8 h-12 text-base font-semibold">
            <Info className="w-5 h-5" /> More Info
          </Button>
        </div>
      </div>
    </section>
  );
}