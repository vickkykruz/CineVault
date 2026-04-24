import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TmdbService, Movie, MOOD_GENRE_MAP } from '../../core/services/tmdb.service';
import { AnalyticsService } from '../../core/services/analytics.service';
 
interface Genre { id: number; name: string; }
interface Mood  { key: string; label: string; emoji: string; }
 
@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './discover.html',
  styleUrl:    './discover.scss',
})
export class Discover implements OnInit {
  private readonly tmdb      = inject(TmdbService);
  private readonly route     = inject(ActivatedRoute);
  private readonly router    = inject(Router);
  private readonly analytics = inject(AnalyticsService);
 
  // ── State ──────────────────────────────────────────────
  movies       = signal<Movie[]>([]);
  genres       = signal<Genre[]>([]);
  isLoading    = signal(true);
  currentPage  = signal(1);
  totalPages   = signal(1);
  searchQuery  = signal('');
  activeGenre  = signal<number | null>(null);
  activeMood   = signal<string | null>(null);
  activeSort   = signal('popularity.desc');
  searchInput  = '';
 
  readonly sortOptions = [
    { value: 'popularity.desc',    label: 'Most Popular'  },
    { value: 'vote_average.desc',  label: 'Highest Rated' },
    { value: 'release_date.desc',  label: 'Newest First'  },
    { value: 'release_date.asc',   label: 'Oldest First'  },
  ];
 
  readonly moods: Mood[] = [
    { key: 'intense',     label: 'Intense',      emoji: '😤' },
    { key: 'funny',       label: 'Funny',        emoji: '😂' },
    { key: 'emotional',   label: 'Emotional',    emoji: '💔' },
    { key: 'scary',       label: 'Scary',        emoji: '😱' },
    { key: 'mindblowing', label: 'Mind-Blowing', emoji: '🌍' },
    { key: 'feelgood',    label: 'Feel-Good',    emoji: '❤️' },
    { key: 'dark',        label: 'Dark',         emoji: '🌙' },
    { key: 'stunning',    label: 'Stunning',     emoji: '✨' },
  ];
 
  ngOnInit(): void {
    // Load genres
    this.tmdb.getGenres().subscribe({
      next: (res) => this.genres.set(res.genres),
    });
 
    // Check for search query from navbar
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.searchInput = params['q'];
        this.searchQuery.set(params['q']);
        this.search();
      } else {
        this.loadDiscover();
      }
    });
  }
 
  // ── Load ───────────────────────────────────────────────
  loadDiscover(page = 1): void {
    this.isLoading.set(true);
    this.currentPage.set(page);
 
    if (this.searchQuery()) {
      this.tmdb.searchMovies(this.searchQuery(), page).subscribe({
        next: (res) => {
          this.movies.set(res.results);
          this.totalPages.set(Math.min(res.total_pages, 20));
          this.isLoading.set(false);
        },
      });
      return;
    }
 
    if (this.activeMood()) {
      this.tmdb.getMoviesByMood(this.activeMood()!, page).subscribe({
        next: (res) => {
          this.movies.set(res.results);
          this.totalPages.set(Math.min(res.total_pages, 20));
          this.isLoading.set(false);
        },
      });
      return;
    }
 
    // Discover with genre + sort filters
    const params: any = {
      sort_by: this.activeSort(),
      page,
      'vote_count.gte': 50,
    };
    if (this.activeGenre()) {
      params['with_genres'] = this.activeGenre();
    }
 
    this.tmdb.discoverMovies(params).subscribe({
      next: (res) => {
        this.movies.set(res.results);
        this.totalPages.set(Math.min(res.total_pages, 20));
        this.isLoading.set(false);
      },
    });
  }
 
  // ── Actions ────────────────────────────────────────────
  search(): void {
    if (!this.searchInput.trim()) {
      this.clearSearch();
      return;
    }
    this.searchQuery.set(this.searchInput.trim());
    this.activeGenre.set(null);
    this.activeMood.set(null);
    this.loadDiscover(1);
    this.analytics.trackMovieSearched(this.searchInput.trim(), 0);
    this.router.navigate([], {
      queryParams: { q: this.searchInput.trim() },
      queryParamsHandling: 'merge',
    });
  }
 
  onSearchKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this.search();
  }
 
  clearSearch(): void {
    this.searchInput = '';
    this.searchQuery.set('');
    this.router.navigate([], { queryParams: {} });
    this.loadDiscover(1);
  }
 
  selectGenre(id: number | null): void {
    this.activeGenre.set(id);
    this.activeMood.set(null);
    this.searchQuery.set('');
    this.searchInput = '';
    if (id) {
      const genre = this.genres().find(g => g.id === id);
      if (genre) this.analytics.trackMovieFiltered('genre', genre.name);
    }
    this.loadDiscover(1);
  }
 
  selectMood(key: string): void {
    this.activeMood.set(this.activeMood() === key ? null : key);
    this.activeGenre.set(null);
    this.searchQuery.set('');
    this.searchInput = '';
    if (this.activeMood()) {
      this.analytics.trackMovieFiltered('mood', key);
    }
    this.loadDiscover(1);
  }
 
  selectSort(value: string): void {
    this.activeSort.set(value);
    this.analytics.trackMovieFiltered('sort', value);
    this.loadDiscover(1);
  }
 
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadDiscover(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  goToMovie(id: number): void {
    this.router.navigate(['/movie', id]);
  }
 
  // ── Helpers ────────────────────────────────────────────
  getPoster(path: string): string {
    return this.tmdb.getPosterUrl(path, 'w500');
  }
 
  getRating(v: number): string { return v?.toFixed(1) ?? 'N/A'; }
  getYear(d: string): string   { return d ? d.split('-')[0] : ''; }
 
  getPageNumbers(): number[] {
    const current = this.currentPage();
    const total   = this.totalPages();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end   = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
 
  getActiveFilterLabel(): string {
    if (this.searchQuery()) return `Results for "${this.searchQuery()}"`;
    if (this.activeMood()) {
      const m = this.moods.find(x => x.key === this.activeMood());
      return m ? `${m.emoji} ${m.label}` : '';
    }
    if (this.activeGenre()) {
      const g = this.genres().find(x => x.id === this.activeGenre());
      return g ? g.name : '';
    }
    return 'All Movies';
  }
 
  trackById(_: number, item: Movie): number { return item.id; }
}
 