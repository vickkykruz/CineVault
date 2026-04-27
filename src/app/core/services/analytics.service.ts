import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
} from '@angular/fire/firestore';
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
  type:         AnalyticsEvent;
  page:         string;
  country:      string;
  country_code: string;
  city:         string;
  source:       string;
  user_id?:     string;
  meta?:        Record<string, unknown>;
}
 
// Location cache — ipinfo.io called once per session
let _locationCache: { country: string; country_code: string; city: string } | null = null;
 
async function getLocation(): Promise<{ country: string; country_code: string; city: string }> {
  if (_locationCache) return _locationCache;
  try {
    const res  = await fetch('https://ipinfo.io/json', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    _locationCache = {
      country:      data.country || 'Unknown',
      country_code: data.country || 'XX',
      city:         data.city    || 'Unknown',
    };
    return _locationCache;
  } catch {
    return { country: 'Unknown', country_code: 'XX', city: 'Unknown' };
  }
}
 
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http      = inject(HttpClient);
  private readonly auth      = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly injector  = inject(EnvironmentInjector);
 
  // Portfolio API — fallback/timeline only
  private readonly endpoint = 'https://api.vickkykruzprogramming.dev/api/activity';
 
  // ── Main track method ──────────────────────────────────
  track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
    getLocation().then(async loc => {
      const userId = this.auth.currentUser?.uid;
 
      const payload: AnalyticsPayload = {
        type:         event,
        page:         window.location.pathname,
        country:      loc.country,
        country_code: loc.country_code,
        city:         loc.city,
        source:       'cinevault',
        ...(userId ? { user_id: userId } : {}),
        meta: {
          ...(properties ?? {}),
          appVersion: '1.0.0',
          platform:   'web',
        },
      };
 
      // ── Step 1: Write to Firestore FIRST (primary) ──────
      await this.writeToFirestore(userId, event, payload);
 
      // ── Step 2: Fire to portfolio API (fallback/timeline)
      this.http.post(this.endpoint, payload).subscribe({
        error: (err) => {
          if (!environment.production) {
            console.warn('[Analytics] Portfolio API failed:', event, err);
          }
        },
      });
    });
  }
 
  // ── Write activity log to Firestore ───────────────────
  private async writeToFirestore(
    userId: string | undefined,
    event: AnalyticsEvent,
    payload: AnalyticsPayload
  ): Promise<void> {
    try {
      await runInInjectionContext(this.injector, async () => {
        // Global activity log — all events regardless of user
        const globalRef = collection(this.firestore, 'activity_logs');
        await addDoc(globalRef, {
          ...payload,
          timestamp: Date.now(),
        });
 
        // Per-user activity log — if user is logged in
        if (userId) {
          const userRef = collection(
            this.firestore, `users/${userId}/activity_logs`
          );
          await addDoc(userRef, {
            type:      event,
            page:      payload.page,
            timestamp: Date.now(),
            meta:      payload.meta ?? {},
          });
        }
      });
    } catch (err) {
      // Silently fail — never block the UI for analytics
      if (!environment.production) {
        console.warn('[Analytics] Firestore write failed:', event, err);
      }
    }
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
 