import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TmdbService, Movie, MOOD_GENRE_MAP } from '../../core/services/tmdb.service';
import { AuthService } from '../../core/services/auth.service';
 
interface Mood {
  key: string;
  label: string;
  emoji: string;
}
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly tmdb = inject(TmdbService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
 
  // ── State ──────────────────────────────────────────────────
  heroMovie = signal<Movie | null>(null);
  trendingMovies = signal<Movie[]>([]);
  topRatedMovies = signal<Movie[]>([]);
  moodMovies = signal<Movie[]>([]);
  activeMood = signal<string>('intense');
  isLoading = signal<boolean>(true);
  searchQuery = '';
 
  readonly moods: Mood[] = [
    { key: 'intense',     label: 'Intense & Gripping', emoji: '😤' },
    { key: 'funny',       label: 'Light & Funny',       emoji: '😂' },
    { key: 'emotional',   label: 'Emotionally Wrecked', emoji: '💔' },
    { key: 'scary',       label: 'Edge of My Seat',     emoji: '😱' },
    { key: 'mindblowing', label: 'Mind-Expanding',      emoji: '🌍' },
    { key: 'feelgood',    label: 'Warm & Feel-Good',    emoji: '❤️' },
    { key: 'dark',        label: 'Dark & Brooding',     emoji: '🌙' },
    { key: 'stunning',    label: 'Visually Stunning',   emoji: '✨' },
  ];
 
  // ── Lifecycle ──────────────────────────────────────────────
  ngOnInit(): void {
    this.loadHomeData();
  }
 
  // ── Data Loading ───────────────────────────────────────────
  loadHomeData(): void {
    this.isLoading.set(true);
 
    // Trending
    this.tmdb.getTrending('week').subscribe({
      next: (res) => {
        this.trendingMovies.set(res.results.slice(0, 10));
        this.heroMovie.set(res.results[0]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load trending movies', err);
        this.isLoading.set(false);
      },
    });
 
    // Top Rated
    this.tmdb.getTopRated().subscribe({
      next: (res) => this.topRatedMovies.set(res.results.slice(0, 5)),
      error: (err) => console.error('Failed to load top rated', err),
    });
 
    // Mood-based (default mood)
    this.loadMoodMovies(this.activeMood());
  }
 
  loadMoodMovies(mood: string): void {
    this.activeMood.set(mood);
    this.tmdb.getMoviesByMood(mood).subscribe({
      next: (res) => this.moodMovies.set(res.results.slice(0, 5)),
      error: (err) => console.error('Failed to load mood movies', err),
    });
  }
 
  // ── Actions ────────────────────────────────────────────────
  goToMovie(id: number): void {
    this.router.navigate(['/movie', id]);
  }
 
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/discover'], {
        queryParams: { q: this.searchQuery.trim() },
      });
    }
  }
 
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onSearch();
  }
 
  // ── Helpers ────────────────────────────────────────────────
  getPoster(path: string): string {
    return this.tmdb.getPosterUrl(path, 'w500');
  }
 
  getBackdrop(path: string): string {
    return this.tmdb.getBackdropUrl(path, 'w1280');
  }
 
  getRating(vote: number): string {
    return vote.toFixed(1);
  }
 
  getYear(date: string): string {
    return date ? date.split('-')[0] : '';
  }
 
  trackById(_: number, movie: Movie): number {
    return movie.id;
  }
}
 