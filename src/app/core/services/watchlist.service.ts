import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  collectionData,
  docData,
  getDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
 
export interface WatchlistEntry {
  movieId:      number;
  title:        string;
  poster_path:  string;
  vote_average: number;
  release_date: string;
  overview:     string;
  addedAt:      number;
  watched:      boolean;
  rating?:      number;
}
 
@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly firestore = inject(Firestore);
  private readonly auth      = inject(Auth);
  private readonly injector  = inject(EnvironmentInjector);
 
  // ── Helpers ────────────────────────────────────────────
  private getUserId(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
 
  // ── Get all watchlist entries ──────────────────────────
  getWatchlist(): Observable<WatchlistEntry[]> {
    const uid = this.getUserId();
    if (!uid) return of([]);
 
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, `watchlists/${uid}/movies`);
      return collectionData(ref, { idField: 'id' }) as Observable<WatchlistEntry[]>;
    });
  }
 
  // ── Check if a movie is in the watchlist ───────────────
  isInWatchlist(movieId: number): Observable<boolean> {
    const uid = this.getUserId();
    if (!uid) return of(false);
 
    return runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, `watchlists/${uid}/movies/${movieId}`);
      return docData(ref).pipe(
        map((data) => !!data),
        catchError(() => of(false))
      );
    });
  }
 
  // ── Add movie to watchlist ─────────────────────────────
  async addToWatchlist(
    movie: Omit<WatchlistEntry, 'addedAt' | 'watched'>
  ): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
 
    const ref = doc(this.firestore, `watchlists/${uid}/movies/${movie.movieId}`);
    await setDoc(ref, {
      ...movie,
      addedAt: Date.now(),
      watched: false,
    });
  }
 
  // ── Remove movie from watchlist ────────────────────────
  async removeFromWatchlist(movieId: number): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
 
    const ref = doc(this.firestore, `watchlists/${uid}/movies/${movieId}`);
    await deleteDoc(ref);
  }
 
  // ── Mark as watched / unwatched ────────────────────────
  async toggleWatched(movieId: number, watched: boolean): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
 
    const ref = doc(this.firestore, `watchlists/${uid}/movies/${movieId}`);
    await setDoc(ref, { watched }, { merge: true });
  }
 
  // ── Rate a movie ───────────────────────────────────────
  async rateMovie(movieId: number, rating: number): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
 
    const ref = doc(this.firestore, `watchlists/${uid}/movies/${movieId}`);
    await setDoc(ref, { rating }, { merge: true });
  }
 
  // ── Check watchlist status (one-time read) ─────────────
  async checkInWatchlist(movieId: number): Promise<boolean> {
    const uid = this.getUserId();
    if (!uid) return false;
 
    const ref = doc(this.firestore, `watchlists/${uid}/movies/${movieId}`);
    const snap = await getDoc(ref);
    return snap.exists();
  }
}
 