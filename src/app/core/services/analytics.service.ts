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
  event: AnalyticsEvent;
  userId?: string;
  timestamp: number;
  properties?: Record<string, any>;
}
 
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly endpoint = `${environment.appApiUrl}/analytics/track`;
 
  // ── Main track method ──────────────────────────────────
  track(event: AnalyticsEvent, properties?: Record<string, any>): void {
    const userId = this.auth.currentUser?.uid;
 
    const payload: AnalyticsPayload = {
      event,
      userId,
      timestamp: Date.now(),
      properties: {
        ...properties,
        appVersion: '1.0.0',
        platform:   'web',
      },
    };
 
    // Fire and forget — never block the UI for analytics
    this.http.post(this.endpoint, payload).subscribe({
      error: (err) => {
        // Silently fail — analytics should never break the app
        if (!environment.production) {
          console.warn('[Analytics] Failed to send event:', event, err);
        }
      },
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
    this.track('movie_searched', { query, resultsCount });
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
 