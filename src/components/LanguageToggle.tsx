import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMovieStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export function LanguageToggle() {
  const language = useMovieStore(s => s.language);
  const setLanguage = useMovieStore(s => s.setLanguage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <Languages className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={`focus:bg-zinc-800 ${language === 'en' ? 'text-red-500' : ''}`}
        >
          English (LTR)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('fa')}
          className={`focus:bg-zinc-800 ${language === 'fa' ? 'text-red-500' : ''}`}
        >
          فارسی (RTL)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}