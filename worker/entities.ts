import { IndexedEntity } from "./core-utils";
import type { UserProfile, UserHistoryItem } from "../shared/types";
import { MOCK_USER_PROFILE } from "../shared/mock-data";
export class UserProfileEntity extends IndexedEntity<UserProfile> {
  static readonly entityName = "user_profile";
  static readonly indexName = "user_profiles";
  static readonly initialState: UserProfile = {
    id: "",
    name: "Guest",
    favorites: [],
    watchlist: [],
    history: [],
    preferredLanguage: 'en'
  };
  static seedData = [MOCK_USER_PROFILE];
  async toggleFavorite(movieId: string): Promise<boolean> {
    let isFavorite = false;
    await this.mutate(s => {
      const exists = s.favorites.includes(movieId);
      const next = exists
        ? s.favorites.filter(id => id !== movieId)
        : [...s.favorites, movieId];
      isFavorite = !exists;
      return { ...s, favorites: next };
    });
    return isFavorite;
  }
  async toggleWatchlist(movieId: string): Promise<boolean> {
    let inWatchlist = false;
    await this.mutate(s => {
      const exists = s.watchlist.includes(movieId);
      const next = exists
        ? s.watchlist.filter(id => id !== movieId)
        : [...s.watchlist, movieId];
      inWatchlist = !exists;
      return { ...s, watchlist: next };
    });
    return inWatchlist;
  }
  async updateHistory(item: UserHistoryItem): Promise<void> {
    await this.mutate(s => {
      const filtered = s.history.filter(h => h.movieId !== item.movieId);
      return { ...s, history: [item, ...filtered].slice(0, 20) };
    });
  }
}