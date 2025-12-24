import type { Movie, User, Chat, ChatMessage } from './types';
export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Echoes of Eternity',
    description: 'A brilliant scientist discovers a way to send messages through time, only to realize the consequences of altering the past could destroy the future of humanity.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2024,
    rating: 8.9,
    genres: ['Sci-Fi', 'Thriller'],
    type: 'movie',
    duration: '2h 15m',
    isFeatured: true
  },
  {
    id: '2',
    title: 'The Silent Watcher',
    description: 'In a remote mountain town, a reclusive detective investigates a series of mysterious disappearances that lead to an ancient secret.',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2023,
    rating: 7.5,
    genres: ['Mystery', 'Crime'],
    type: 'movie',
    duration: '1h 58m'
  },
  {
    id: '3',
    title: 'Neon Nights',
    description: 'In a neon-drenched cyberpunk city, a street racer gets caught in a corporate conspiracy that threatens the entire underground world.',
    posterUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2024,
    rating: 8.2,
    genres: ['Action', 'Sci-Fi'],
    type: 'series'
  },
  {
    id: '4',
    title: 'Shadow Realm',
    description: 'A young warrior must journey to the heart of the Shadow Realm to rescue her brother from an ancient dark entity.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2022,
    rating: 6.8,
    genres: ['Fantasy', 'Adventure'],
    type: 'movie',
    duration: '2h 10m'
  },
  {
    id: '5',
    title: 'Urban Jungle',
    description: 'A group of parkour artists discover a hidden treasure buried deep beneath the streets of New York City.',
    posterUrl: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2023,
    rating: 7.1,
    genres: ['Action', 'Comedy'],
    type: 'movie',
    duration: '1h 45m'
  },
  {
    id: '6',
    title: 'Midnight Sun',
    description: 'A romantic drama set in the Arctic Circle where the sun never sets during the peak of summer.',
    posterUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2021,
    rating: 7.9,
    genres: ['Romance', 'Drama'],
    type: 'movie',
    duration: '2h 05m'
  },
  {
    id: '7',
    title: 'The Last Frontier',
    description: 'Astronauts on a mission to Mars face a life-threatening equipment failure and must use their wits to survive.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2024,
    rating: 8.5,
    genres: ['Sci-Fi', 'Adventure'],
    type: 'movie',
    duration: '2h 30m'
  },
  {
    id: '8',
    title: 'Glitch in the Matrix',
    description: 'A hacker discovers that his reality is a simulation and tries to break free with the help of a mysterious woman.',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    releaseYear: 2022,
    rating: 8.0,
    genres: ['Sci-Fi', 'Thriller'],
    type: 'series'
  }
];
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera' },
  { id: 'u2', name: 'Sarah Chen' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'Action Buffs' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'That new sci-fi movie looks incredible!', ts: Date.now() },
];