import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { WatchlistService, WatchlistEntry } from '../../core/services/watchlist.service';
import { AuthService } from '../../core/services/auth.service';
import { TmdbService } from '../../core/services/tmdb.service';
 
type FilterType = 'all' | 'watched' | 'unwatched';
 
@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.scss',
})
export class Watchlist implements OnInit {
  private readonly auth             = inject(Auth);
  private readonly firestore        = inject(Firestore);
  private readonly watchlistService = inject(WatchlistService);
  private readonly authService      = inject(AuthService);
  private readonly tmdb             = inject(TmdbService);
  private readonly router           = inject(Router);
 
  readonly user = this.authService.user;
 
  allMovies    = signal<WatchlistEntry[]>([]);
  activeFilter = signal<FilterType>('all');
  isLoading    = signal(true);
  removingId   = signal<number | null>(null);
 
  // Computed filtered list
  movies = computed(() => {
    const filter = this.activeFilter();
    const all    = this.allMovies();
    if (filter === 'watched')   return all.filter(m => m.watched);
    if (filter === 'unwatched') return all.filter(m => !m.watched);
    return all;
  });
 
  // Computed stats
  stats = computed(() => {
    const all = this.allMovies();
    return {
      total:     all.length,
      watched:   all.filter(m => m.watched).length,
      unwatched: all.filter(m => !m.watched).length,
      avgRating: all.filter(m => m.rating).length
        ? (all.reduce((s, m) => s + (m.rating ?? 0), 0) /
           all.filter(m => m.rating).length).toFixed(1)
        : 'N/A',
    };
  });
 
  ngOnInit(): void {
    this.loadWatchlist();
  }
 
  // ── Load directly from Firestore using getDocs ─────────
  async loadWatchlist(): Promise<void> {
    this.isLoading.set(true);
    const uid = this.auth.currentUser?.uid;
    if (!uid) { this.isLoading.set(false); return; }
 
    try {
      const ref      = collection(this.firestore, `watchlists/${uid}/movies`);
      const snapshot = await getDocs(ref);
      const entries  = snapshot.docs
        .map(d => d.data() as WatchlistEntry)
        .sort((a, b) => b.addedAt - a.addedAt);
      this.allMovies.set(entries);
    } catch (err) {
      console.error('Failed to load watchlist', err);
    } finally {
      this.isLoading.set(false);
    }
  }
 
  // ── Actions via service (analytics included) ───────────
  setFilter(f: FilterType): void {
    this.activeFilter.set(f);
  }
 
  async toggleWatched(movie: WatchlistEntry): Promise<void> {
    await this.watchlistService.toggleWatched(
      movie.movieId, !movie.watched, movie.title
    );
    // Update local state immediately
    this.allMovies.update(list =>
      list.map(m => m.movieId === movie.movieId
        ? { ...m, watched: !m.watched } : m
      )
    );
  }
 
  async removeMovie(movieId: number): Promise<void> {
    const movie = this.allMovies().find(m => m.movieId === movieId);
    this.removingId.set(movieId);
    try {
      await this.watchlistService.removeFromWatchlist(movieId, movie?.title);
      this.allMovies.update(list => list.filter(m => m.movieId !== movieId));
    } finally {
      this.removingId.set(null);
    }
  }
 
  async rateMovie(movieId: number, rating: number): Promise<void> {
    const movie = this.allMovies().find(m => m.movieId === movieId);
    await this.watchlistService.rateMovie(movieId, rating, movie?.title);
    this.allMovies.update(list =>
      list.map(m => m.movieId === movieId ? { ...m, rating } : m)
    );
  }
 
  goToMovie(id: number): void { this.router.navigate(['/movie', id]); }
  goToDiscover(): void        { this.router.navigate(['/discover']); }
 
  // ── Helpers ────────────────────────────────────────────
  getPoster(path: string): string  { return this.tmdb.getPosterUrl(path, 'w342'); }
  getYear(date: string): string    { return date ? date.split('-')[0] : ''; }
  getRating(v: number): string     { return v?.toFixed(1) ?? 'N/A'; }
  getStars(rating: number = 0): number[] { return [1, 2, 3, 4, 5]; }
  trackById(_: number, item: WatchlistEntry): number { return item.movieId; }
}
 