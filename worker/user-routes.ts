import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
import { MOCK_MOVIES } from "../shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/movies', async (c) => {
    try {
      const genre = c.req.query('genre');
      const minRating = c.req.query('minRating');
      const search = c.req.query('search');
      const type = c.req.query('type');
      let filtered = [...MOCK_MOVIES];
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(m => 
          m.title.toLowerCase().includes(query) || 
          m.description.toLowerCase().includes(query)
        );
      }
      if (genre && genre !== 'All') {
        filtered = filtered.filter(m => m.genres.includes(genre));
      }
      if (minRating) {
        const rating = parseFloat(minRating);
        if (!isNaN(rating)) {
          filtered = filtered.filter(m => m.rating >= rating);
        }
      }
      if (type && type !== 'all') {
        filtered = filtered.filter(m => m.type === type);
      }
      // Basic pagination
      const limit = parseInt(c.req.query('limit') || '20');
      const offset = parseInt(c.req.query('offset') || '0');
      const page = filtered.slice(offset, offset + limit);
      return ok(c, {
        items: page,
        total: filtered.length,
        hasMore: offset + limit < filtered.length
      });
    } catch (err) {
      return bad(c, 'Failed to fetch movies');
    }
  });
  app.get('/api/movies/featured', async (c) => {
    const featured = MOCK_MOVIES.find(m => m.isFeatured) || MOCK_MOVIES[0];
    return ok(c, featured);
  });
}