import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { TmdbService, MovieDetail as MovieDetailData } from '../../core/services/tmdb.service';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsService } from '../../core/services/analytics.service';
 
interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}
 
interface Video {
  key: string;
  site: string;
  type: string;
}
 
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeUrlPipe],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit {
  private readonly tmdb        = inject(TmdbService);
  private readonly route       = inject(ActivatedRoute);
  private readonly router      = inject(Router);
  private readonly auth        = inject(Auth);
  private readonly firestore   = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly analytics   = inject(AnalyticsService);
 
  movie         = signal<MovieDetailData | null>(null);
  cast          = signal<CastMember[]>([]);
  trailer       = signal<Video | null>(null);
  similarMovies = signal<any[]>([]);
  isLoading     = signal(true);
  showTrailer   = signal(false);
 
  // Watchlist state
  inWatchlist      = signal(false);
  watchlistLoading = signal(false);
  toastMessage     = signal('');
  toastVisible     = signal(false);
 
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) this.loadMovie(id);
    });
  }
 
  loadMovie(id: number): void {
    this.isLoading.set(true);
    this.inWatchlist.set(false);
 
    this.tmdb.getMovieDetail(id).subscribe({
      next: async (res: any) => {
        this.movie.set(res);
        this.cast.set(res.credits?.cast?.slice(0, 12) ?? []);
 
        const videos  = res.videos?.results ?? [];
        const trailer = videos.find(
          (v: Video) => v.site === 'YouTube' && v.type === 'Trailer'
        );
        this.trailer.set(trailer ?? null);
        this.similarMovies.set(res.similar?.results?.slice(0, 6) ?? []);
        this.isLoading.set(false);
 
        // Track view
        this.analytics.trackMovieViewed(res.id, res.title);
 
        // Check watchlist status using getDoc (no injection context issue)
        if (this.authService.isLoggedIn()) {
          await this.checkWatchlistStatus(id);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
    });
  }
 
  // ── Check watchlist using getDoc ───────────────────────
  private async checkWatchlistStatus(movieId: number): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    try {
      const ref  = doc(this.firestore, `watchlists/${uid}/movies/${movieId}`);
      const snap = await getDoc(ref);
      this.inWatchlist.set(snap.exists());
    } catch {
      this.inWatchlist.set(false);
    }
  }
 
  // ── Toggle watchlist ───────────────────────────────────
  async toggleWatchlist(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
 
    const m   = this.movie();
    const uid = this.auth.currentUser?.uid;
    if (!m || !uid) return;
 
    this.watchlistLoading.set(true);
 
    try {
      const ref = doc(this.firestore, `watchlists/${uid}/movies/${m.id}`);
 
      if (this.inWatchlist()) {
        await deleteDoc(ref);
        this.inWatchlist.set(false);
        this.analytics.trackWatchlistRemoved(m.id, m.title);
        this.showToast('Removed from watchlist');
      } else {
        await setDoc(ref, {
          movieId:      m.id,
          title:        m.title,
          poster_path:  m.poster_path,
          vote_average: m.vote_average,
          release_date: m.release_date,
          overview:     m.overview,
          addedAt:      Date.now(),
          watched:      false,
        });
        this.inWatchlist.set(true);
        this.analytics.trackWatchlistAdded(m.id, m.title);
        this.showToast('Added to watchlist ✓');
      }
    } catch (err) {
      this.showToast('Something went wrong');
    } finally {
      this.watchlistLoading.set(false);
    }
  }
 
  private showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 3000);
  }
 
  // ── Helpers ────────────────────────────────────────────
  getPoster(path: string): string   { return this.tmdb.getPosterUrl(path, 'w500'); }
  getBackdrop(path: string): string { return this.tmdb.getBackdropUrl(path, 'w1280'); }
  getProfile(path: string): string  { return path ? this.tmdb.getPosterUrl(path, 'w342') : ''; }
  getRating(vote: number): string   { return vote?.toFixed(1) ?? 'N/A'; }
  getYear(date: string): string     { return date ? date.split('-')[0] : ''; }
 
  getRuntime(mins: number): string {
    if (!mins) return '';
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }
 
  getRatingPercent(vote: number): number {
    return Math.round((vote / 10) * 100);
  }
 
  goBack(): void { window.history.back(); }
 
  goToMovie(id: number): void {
    this.router.navigate(['/movie', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  openTrailer(): void {
    this.showTrailer.set(true);
    const m = this.movie();
    if (m) this.analytics.trackTrailerWatched(m.id, m.title);
  }
 
  closeTrailer(): void { this.showTrailer.set(false); }
 
  trackById(_: number, item: any): number { return item.id; }
}
 