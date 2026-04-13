import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { TmdbService, MovieDetail as MovieDetailData } from '../../core/services/tmdb.service';
 
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
  private readonly tmdb = inject(TmdbService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
 
  movie = signal<MovieDetailData | null>(null);
  cast = signal<CastMember[]>([]);
  trailer = signal<Video | null>(null);
  similarMovies = signal<any[]>([]);
  isLoading = signal(true);
  showTrailer = signal(false);
 
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) this.loadMovie(id);
    });
  }
 
  loadMovie(id: number): void {
    this.isLoading.set(true);
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
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
    });
  }
 
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
 
  goBack(): void {
    window.history.back();
  }
 
  goToMovie(id: number): void {
    this.router.navigate(['/movie', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  openTrailer(): void { this.showTrailer.set(true); }
  closeTrailer(): void { this.showTrailer.set(false); }
 
  trackById(_: number, item: any): number { return item.id; }
}
 