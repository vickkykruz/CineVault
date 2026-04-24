import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { TmdbService, MovieDetail as MovieDetailData } from '../../core/services/tmdb.service';
import { WatchlistService } from '../../core/services/watchlist.service';
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
  private readonly tmdb             = inject(TmdbService);
  private readonly route            = inject(ActivatedRoute);
  private readonly router           = inject(Router);
  private readonly watchlistService = inject(WatchlistService);
  private readonly authService      = inject(AuthService);
  private readonly analytics        = inject(AnalyticsService);
 
  movie         = signal<MovieDetailData | null>(null);
  cast          = signal<CastMember[]>([]);
  trailer       = signal<Video | null>(null);
  similarMovies = signal<any[]>([]);
  isLoading     = signal(true);
  showTrailer   = signal(false);
 
  // Watchlist state
  inWatchlist     = signal(false);
  watchlistLoading = signal(false);
  toastMessage    = signal('');
  toastVisible    = signal(false);
 
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
      next: (res: any) => {
        this.movie.set(res);
        const cast = res.credits?.cast?.slice(0, 12) ?? [];
        this.cast.set(cast);
        const videos = res.videos?.results ?? [];
        const trailer = videos.find(
          (v: Video) => v.site === 'YouTube' && v.type === 'Trailer'
        );
        this.trailer.set(trailer ?? null);
        const similar = res.similar?.results?.slice(0, 6) ?? [];
        this.similarMovies.set(similar);
        this.isLoading.set(false);
 
        // Track movie view
        this.analytics.trackMovieViewed(res.id, res.title);
 
        // Check watchlist status if user is logged in
        if (this.authService.isLoggedIn()) {
          this.watchlistService.isInWatchlist(id).subscribe({
            next: (inList) => this.inWatchlist.set(inList),
          });
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
    });
  }
 
  // ── Watchlist ──────────────────────────────────────────
  async toggleWatchlist(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
 
    const m = this.movie();
    if (!m) return;
 
    this.watchlistLoading.set(true);
 
    try {
      if (this.inWatchlist()) {
        await this.watchlistService.removeFromWatchlist(m.id);
        this.inWatchlist.set(false);
        this.analytics.trackWatchlistRemoved(m.id, m.title);
        this.showToast('Removed from watchlist');
      } else {
        await this.watchlistService.addToWatchlist({
          movieId:      m.id,
          title:        m.title,
          poster_path:  m.poster_path,
          vote_average: m.vote_average,
          release_date: m.release_date,
          overview:     m.overview,
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
  getPoster(path: string): string {
    return this.tmdb.getPosterUrl(path, 'w500');
  }
 
  getBackdrop(path: string): string {
    return this.tmdb.getBackdropUrl(path, 'w1280');
  }
 
  getProfile(path: string): string {
    return path ? this.tmdb.getPosterUrl(path, 'w342') : '';
  }
 
  getRating(vote: number): string {
    return vote?.toFixed(1) ?? 'N/A';
  }
 
  getYear(date: string): string {
    return date ? date.split('-')[0] : '';
  }
 
  getRuntime(mins: number): string {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }
 
  getRatingPercent(vote: number): number {
    return Math.round((vote / 10) * 100);
  }
 
  goBack(): void { window.history.back(); }
 
  goToMovie(id: number): void {
    this.router.navigate(['/movie', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  openTrailer(): void  {
    this.showTrailer.set(true);
    const m = this.movie();
    if (m) this.analytics.trackTrailerWatched(m.id, m.title);
  }
  closeTrailer(): void { this.showTrailer.set(false); }
 
  trackById(_: number, item: any): number { return item.id; }
}
 