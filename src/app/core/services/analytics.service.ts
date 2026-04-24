import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
 
export type AnalyticsEvent =
  // Auth
  | 'user_login'
  | 'user_logout'
  | 'user_register'
  // Movies
  | 'movie_viewed'
  | 'movie_searched'
  | 'movie_filtered'
  | 'trailer_watched'
  // Watchlist
  | 'watchlist_added'
  | 'watchlist_removed'
  | 'watchlist_marked_watched'
  | 'watchlist_rated'
  // Verdict
  | 'verdict_session_created'
  | 'verdict_session_joined'
  | 'verdict_match_found'
  // Time Capsule
  | 'capsule_created'
  | 'capsule_unsealed';
 
export interface AnalyticsPayload {
  type:         AnalyticsEvent;   // renamed from "event" to match API
  page:         string;           // current URL path
  country:      string;
  country_code: string;
  city:         string;
  source:       string;           // always "cinevault"
  user_id?:     string;           // Firebase UID for per-user analytics
  meta?:        Record<string, unknown>;
}
 
// Location cache — ipinfo.io called at most once per session
let _locationCache: { country: string; country_code: string; city: string } | null = null;
 
async function getLocation(): Promise<{ country: string; country_code: string; city: string }> {
  if (_locationCache) return _locationCache;
  try {
    const res  = await fetch("https://ipinfo.io/json",
      { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    _locationCache = {
      country:      data.country || "Unknown",
      country_code: data.country || "XX",
      city:         data.city    || "Unknown",
    };
    return _locationCache;
  } catch {
    return { country: "Unknown", country_code: "XX", city: "Unknown" };
  }
}
 
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  // Reuse the existing portfolio activity endpoint
  private readonly endpoint = "https://api.vickkykruzprogramming.dev/api/activity";
 
  // ── Main track method ──────────────────────────────────
  track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
    // Fire and forget — never blocks the UI
    getLocation().then(loc => {
      const userId = this.auth.currentUser?.uid;
 
      const payload: AnalyticsPayload = {
        type:         event,
        page:         window.location.pathname,
        country:      loc.country,
        country_code: loc.country_code,
        city:         loc.city,
        source:       "cinevault",
        ...(userId ? { user_id: userId } : {}),
        meta: {
          ...(properties as Record<string, unknown>),
          appVersion: "1.0.0",
          platform:   "web",
        },
      };
 
      this.http.post(this.endpoint, payload).subscribe({
        error: (err) => {
          // Silently fail — analytics should never break the app
          if (!environment.production) {
            console.warn("[Analytics] Failed to send event:", event, err);
          }
        },
      });
    });
  }
 
  // ── Convenience methods ────────────────────────────────
  trackLogin(method: 'google' | 'email'): void {
    this.track('user_login', { method });
  }
 
  trackLogout(): void {
    this.track('user_logout');
  }
 
  trackRegister(method: 'google' | 'email'): void {
    this.track('user_register', { method });
  }
 
  trackMovieViewed(movieId: number, title: string): void {
    this.track('movie_viewed', { movieId, title });
  }
 
  trackMovieSearched(query: string, resultsCount: number): void {
    this.track('movie_searched', { query, resultsCount: resultsCount as unknown as Record<string, unknown> });
  }
 
  trackMovieFiltered(filterType: 'genre' | 'mood' | 'sort', value: string): void {
    this.track('movie_filtered', { filterType, value });
  }
 
  trackTrailerWatched(movieId: number, title: string): void {
    this.track('trailer_watched', { movieId, title });
  }
 
  trackWatchlistAdded(movieId: number, title: string): void {
    this.track('watchlist_added', { movieId, title });
  }
 
  trackWatchlistRemoved(movieId: number, title: string): void {
    this.track('watchlist_removed', { movieId, title });
  }
 
  trackWatchlistMarkedWatched(movieId: number, title: string): void {
    this.track('watchlist_marked_watched', { movieId, title });
  }
 
  trackWatchlistRated(movieId: number, title: string, rating: number): void {
    this.track('watchlist_rated', { movieId, title, rating });
  }
 
  trackVerdictSessionCreated(sessionId: string): void {
    this.track('verdict_session_created', { sessionId });
  }
 
  trackVerdictSessionJoined(sessionId: string): void {
    this.track('verdict_session_joined', { sessionId });
  }
 
  trackVerdictMatchFound(movieId: number, title: string, sessionId: string): void {
    this.track('verdict_match_found', { movieId, title, sessionId });
  }
 
  trackCapsuleCreated(movieId: number, unlockAt: number): void {
    this.track('capsule_created', { movieId, unlockAt });
  }
 
  trackCapsuleUnsealed(capsuleId: string, movieId: number): void {
    this.track('capsule_unsealed', { capsuleId, movieId });
  }
}
 