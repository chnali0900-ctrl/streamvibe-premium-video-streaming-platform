import React from 'react';
import { useMovieStore } from '@/lib/store';
import { GENRES } from '@/shared/mock-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
export function FilterSidebar() {
  const activeGenre = useMovieStore(s => s.activeGenre);
  const minRating = useMovieStore(s => s.minRating);
  const contentType = useMovieStore(s => s.contentType);
  const setGenre = useMovieStore(s => s.setGenre);
  const setMinRating = useMovieStore(s => s.setMinRating);
  const setContentType = useMovieStore(s => s.setContentType);
  return (
    <div className="w-full space-y-6 py-6 pr-4">
      <div>
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        <Accordion type="multiple" defaultValue={['genres', 'rating', 'type']} className="w-full">
          <AccordionItem value="genres" className="border-zinc-800">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">Genres</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 pt-2">
                {GENRES.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={activeGenre === genre}
                      onCheckedChange={() => setGenre(genre)}
                      className="border-zinc-700 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <Label
                      htmlFor={`genre-${genre}`}
                      className="text-sm font-normal text-zinc-400 cursor-pointer hover:text-white transition-colors"
                    >
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="type" className="border-zinc-800">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">Content Type</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={contentType} onValueChange={(v: any) => setContentType(v)} className="pt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="type-all" className="border-zinc-700 text-red-600" />
                  <Label htmlFor="type-all" className="text-sm font-normal text-zinc-400">All Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="movie" id="type-movie" className="border-zinc-700 text-red-600" />
                  <Label htmlFor="type-movie" className="text-sm font-normal text-zinc-400">Movies</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="series" id="type-series" className="border-zinc-700 text-red-600" />
                  <Label htmlFor="type-series" className="text-sm font-normal text-zinc-400">Series</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rating" className="border-zinc-800">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">Minimum Rating</AccordionTrigger>
            <AccordionContent className="pt-4 px-2">
              <div className="space-y-4">
                <Slider
                  value={[minRating]}
                  max={10}
                  step={0.5}
                  onValueChange={(val) => setMinRating(val[0])}
                  className="[&_[role=slider]]:bg-red-600 [&_[role=slider]]:border-red-600"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Any</span>
                  <span className="text-red-500 font-bold">{minRating}+ IMDB</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}