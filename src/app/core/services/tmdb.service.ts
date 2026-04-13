import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
 
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
}
 
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
 
export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string }[];
}
 
// Mood → TMDB genre IDs mapping
export const MOOD_GENRE_MAP: Record<string, number[]> = {
  'intense':    [28, 53, 80],        // Action, Thriller, Crime
  'funny':      [35, 10751],         // Comedy, Family
  'emotional':  [18, 10749],         // Drama, Romance
  'scary':      [27, 9648],          // Horror, Mystery
  'mindblowing':[878, 99, 36],       // Sci-Fi, Documentary, History
  'feelgood':   [35, 10751, 16],     // Comedy, Family, Animation
  'dark':       [18, 27, 53],        // Drama, Horror, Thriller
  'stunning':   [12, 14, 878],       // Adventure, Fantasy, Sci-Fi
};
 
@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.tmdbBaseUrl;
  private readonly imgBase = environment.tmdbImageUrl;
 
  // ── Image helpers ──────────────────────────────────────────
  getPosterUrl(path: string, size: 'w342' | 'w500' | 'w780' = 'w500'): string {
    return path ? `${this.imgBase}/${size}${path}` : 'assets/images/poster-placeholder.png';
  }
 
  getBackdropUrl(path: string, size: 'w780' | 'w1280' = 'w1280'): string {
    return path ? `${this.imgBase}/${size}${path}` : 'assets/images/backdrop-placeholder.png';
  }
 
  // ── Trending ───────────────────────────────────────────────
  getTrending(timeWindow: 'day' | 'week' = 'week'): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.base}/trending/movie/${timeWindow}`);
  }
 
  // ── Popular ────────────────────────────────────────────────
  getPopular(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.base}/movie/popular`, {
      params: new HttpParams().set('page', page),
    });
  }
 
  // ── Top Rated ──────────────────────────────────────────────
  getTopRated(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.base}/movie/top_rated`, {
      params: new HttpParams().set('page', page),
    });
  }
 
  // ── Now Playing ────────────────────────────────────────────
  getNowPlaying(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.base}/movie/now_playing`, {
      params: new HttpParams().set('page', page),
    });
  }
 
  // ── Movie Detail ───────────────────────────────────────────
  getMovieDetail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.base}/movie/${id}`, {
      params: new HttpParams().set('append_to_response', 'credits,videos,similar'),
    });
  }
 
  // ── Discover with filters ──────────────────────────────────
  discoverMovies(filters: Record<string, any> = {}): Observable<MovieResponse> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, val]) => {
      params = params.set(key, val);
    });
    return this.http.get<MovieResponse>(`${this.base}/discover/movie`, { params });
  }
 
  // ── Search ─────────────────────────────────────────────────
  searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.base}/search/movie`, {
      params: new HttpParams()
        .set('query', query)
        .set('page', page)
        .set('include_adult', false),
    });
  }
 
  // ── Mood-based Discovery ───────────────────────────────────
  getMoviesByMood(mood: string, page = 1): Observable<MovieResponse> {
    const genreIds = MOOD_GENRE_MAP[mood] ?? [];
    return this.http.get<MovieResponse>(`${this.base}/discover/movie`, {
      params: new HttpParams()
        .set('with_genres', genreIds.join(','))
        .set('sort_by', 'popularity.desc')
        .set('vote_count.gte', 100)
        .set('page', page),
    });
  }
 
  // ── Genres List ────────────────────────────────────────────
  getGenres(): Observable<{ genres: { id: number; name: string }[] }> {
    return this.http.get<{ genres: { id: number; name: string }[] }>(
      `${this.base}/genre/movie/list`
    );
  }
}
 