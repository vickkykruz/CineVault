import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
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
 
  // ── Helpers ────────────────────────────────────────────
  private getUserId(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
 
  private watchlistRef(userId: string) {
    return collection(this.firestore, `watchlists/${userId}/movies`);
  }
 
  private movieDocRef(userId: string, movieId: number) {
    return doc(this.firestore, `watchlists/${userId}/movies/${movieId}`);
  }
 
  // ── Get all watchlist entries ──────────────────────────
  getWatchlist(): Observable<WatchlistEntry[]> {
    const uid = this.getUserId();
    if (!uid) return of([]);
    return collectionData(
      this.watchlistRef(uid), { idField: 'id' }
    ) as Observable<WatchlistEntry[]>;
  }
 
  // ── Check if a movie is in the watchlist ───────────────
  isInWatchlist(movieId: number): Observable<boolean> {
    const uid = this.getUserId();
    if (!uid) return of(false);
    return docData(
      doc(this.firestore, `watchlists/${uid}/movies/${movieId}`)
    ).pipe(
      map((data) => !!data),
      catchError(() => of(false))
    );
  }
 
  // ── Add movie to watchlist ─────────────────────────────
  async addToWatchlist(
    movie: Omit<WatchlistEntry, 'addedAt' | 'watched'>
  ): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
    await setDoc(this.movieDocRef(uid, movie.movieId), {
      ...movie,
      addedAt: Date.now(),
      watched: false,
    });
  }
 
  // ── Remove movie from watchlist ────────────────────────
  async removeFromWatchlist(movieId: number): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
    await deleteDoc(this.movieDocRef(uid, movieId));
  }
 
  // ── Mark as watched / unwatched ────────────────────────
  async toggleWatched(movieId: number, watched: boolean): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
    await setDoc(
      this.movieDocRef(uid, movieId),
      { watched },
      { merge: true }
    );
  }
 
  // ── Rate a movie ───────────────────────────────────────
  async rateMovie(movieId: number, rating: number): Promise<void> {
    const uid = this.getUserId();
    if (!uid) throw new Error('User not authenticated');
    await setDoc(
      this.movieDocRef(uid, movieId),
      { rating },
      { merge: true }
    );
  }
}
 