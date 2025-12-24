import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { MOCK_MOVIES } from "../shared/mock-data";
import { UserProfileEntity } from "./entities";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Movie Discovery
  app.get('/api/movies', async (c) => {
    try {
      const genre = c.req.query('genre');
      const minRating = c.req.query('minRating');
      const search = c.req.query('search');
      const type = c.req.query('type');
      const sortBy = c.req.query('sortBy') || 'newest';
      console.log(`[WORKER] Fetch movies: genre=${genre}, search=${search}, rating=${minRating}, type=${type}`);
      let filtered = [...MOCK_MOVIES];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(m =>
          m.title.toLowerCase().includes(query) ||
          m.originalTitle?.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query)
        );
      }
      if (genre && genre !== 'All') {
        filtered = filtered.filter(m => m.genres.includes(genre));
      }
      if (minRating) {
        const rating = parseFloat(minRating);
        if (!isNaN(rating)) filtered = filtered.filter(m => m.rating >= rating);
      }
      if (type && type !== 'all') {
        filtered = filtered.filter(m => m.type === type);
      }
      if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else if (sortBy === 'newest') filtered.sort((a, b) => b.releaseYear - a.releaseYear);
      const limit = parseInt(c.req.query('limit') || '20');
      const offset = parseInt(c.req.query('offset') || '0');
      return ok(c, {
        items: filtered.slice(offset, offset + limit),
        total: filtered.length
      });
    } catch (err) {
      console.error(`[WORKER] movies endpoint error:`, err);
      return bad(c, 'Failed to fetch movies');
    }
  });
  app.get('/api/movies/featured', async (c) => {
    const featured = MOCK_MOVIES.find(m => m.isFeatured) || MOCK_MOVIES[0];
    return ok(c, featured);
  });
  app.get('/api/movies/:id', async (c) => {
    const movie = MOCK_MOVIES.find(m => m.id === c.req.param('id'));
    if (!movie) return notFound(c, 'Movie not found');
    return ok(c, movie);
  });
  // User Profile & Personalization
  app.get('/api/user/profile', async (c) => {
    try {
      const userId = 'u1';
      await UserProfileEntity.ensureSeed(c.env);
      const entity = new UserProfileEntity(c.env, userId);
      const profile = await entity.getState();
      return ok(c, profile);
    } catch (err) {
      console.error(`[WORKER] profile endpoint error:`, err);
      return bad(c, 'Failed to fetch user profile');
    }
  });
  app.post('/api/user/favorites', async (c) => {
    const { movieId } = await c.req.json();
    if (!movieId) return bad(c, 'movieId required');
    const entity = new UserProfileEntity(c.env, 'u1');
    const isFav = await entity.toggleFavorite(movieId);
    return ok(c, { isFavorite: isFav });
  });
  app.post('/api/user/watchlist', async (c) => {
    const { movieId } = await c.req.json();
    if (!movieId) return bad(c, 'movieId required');
    const entity = new UserProfileEntity(c.env, 'u1');
    const inList = await entity.toggleWatchlist(movieId);
    return ok(c, { inWatchlist: inList });
  });
  app.post('/api/user/history', async (c) => {
    const { movieId, progress } = await c.req.json();
    if (!movieId) return bad(c, 'movieId required');
    const entity = new UserProfileEntity(c.env, 'u1');
    await entity.updateHistory({ movieId, progress: progress ?? 0, watchedAt: Date.now() });
    return ok(c, { success: true });
  });
}