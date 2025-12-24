import type { Movie, UserProfile } from './types';
const GENRES = ['Action', 'Sci-Fi', 'Thriller', 'Adventure', 'Fantasy', 'Mystery', 'Romance', 'Comedy', 'Drama', 'Horror', 'Animation'];
const generateMovies = (count: number): Movie[] => {
  const movies: Movie[] = [];
  const titles = [
    { en: 'Interstellar', fa: 'میان‌ستاره‌ای' },
    { en: 'The Dark Knight', fa: 'شوالیه تاریکی' },
    { en: 'Inception', fa: 'تلقین' },
    { en: 'The Matrix', fa: 'ماتریکس' },
    { en: 'Blade Runner 2049', fa: 'بلید رانر ۲۰۴۹' },
    { en: 'Arrival', fa: 'ورود' },
    { en: 'Dune', fa: 'تلماسه' },
    { en: 'The Revenant', fa: 'از گور برخاسته' },
    { en: 'Parasite', fa: 'انگل' },
    { en: 'The Grand Budapest Hotel', fa: 'هتل گرند بوداپست' },
    { en: 'Spider-Man: Into the Spider-Verse', fa: 'مرد عنکبوتی: به درون دنیای عنکبوتی' },
    { en: 'Arcane', fa: '��رکین' },
    { en: 'Breaking Bad', fa: 'برکینگ بد' },
    { en: 'Stranger Things', fa: 'اتفاقات عجی��' },
    { en: 'The Last of Us', fa: 'آخرین بازمانده از ما' },
    { en: 'Mad Max: Fury Road', fa: 'مد مکس: جاده خشم' },
    { en: 'John Wick', fa: 'جان ویک' },
    { en: 'Everything Everywhere All at Once', fa: 'همه‌چیز همه‌جا به یکباره' },
    { en: 'Pulp Fiction', fa: 'داستان عامه‌پسند' },
    { en: 'The Godfather', fa: 'پدرخوانده' }
  ];
  for (let i = 0; i < count; i++) {
    const titlePair = titles[i % titles.length];
    const isMovie = i % 3 !== 0;
    const id = (i + 1).toString();
    movies.push({
      id,
      title: titlePair.en,
      originalTitle: titlePair.fa,
      description: `Detailed description for ${titlePair.en} (${titlePair.fa}). This is a cinematic masterpiece that explores profound themes through stunning visuals and gripping performances. Experience the journey of a lifetime.`,
      posterUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 100000)}?q=80&w=1000&auto=format&fit=crop`,
      backdropUrl: `https://images.unsplash.com/photo-${1510000000000 + (i * 100000)}?q=80&w=1600&auto=format&fit=crop`,
      releaseYear: 2010 + (i % 15),
      rating: 6.5 + (Math.random() * 3),
      genres: [GENRES[i % GENRES.length], GENRES[(i + 1) % GENRES.length]],
      type: isMovie ? 'movie' : 'series',
      duration: isMovie ? `${Math.floor(Math.random() * 60) + 90}m` : `${Math.floor(Math.random() * 5) + 4} Seasons`,
      isFeatured: i === 0,
      trailerUrl: 'dQw4w9WgXcQ',
      cast: ['Actor A', 'Actor B', 'Actor C', 'Actor D']
    });
  }
  return movies;
};
export const MOCK_MOVIES: Movie[] = generateMovies(45);
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'u1',
  name: 'Demo User',
  email: 'demo@streamvibe.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  favorites: ['1', '5', '8'],
  watchlist: ['2', '12'],
  history: [
    { movieId: '3', progress: 45, watchedAt: Date.now() - 86400000 }
  ],
  preferredLanguage: 'en'
};