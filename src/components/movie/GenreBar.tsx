import React from 'react';
import { motion } from 'framer-motion';
import { useMovieStore } from '@/lib/store';
import { GENRES } from '@/shared/mock-data';
import { cn } from '@/lib/utils';
export function GenreBar() {
  const activeGenre = useMovieStore(s => s.activeGenre);
  const setGenre = useMovieStore(s => s.setGenre);
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max">
        {GENRES.map((genre) => {
          const isActive = activeGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => setGenre(genre)}
              className={cn(
                "relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border",
                isActive
                  ? "text-white border-red-600"
                  : "text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white bg-zinc-900/40"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeGenre"
                  className="absolute inset-0 bg-red-600 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}