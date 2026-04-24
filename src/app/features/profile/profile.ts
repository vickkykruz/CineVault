import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, updateProfile } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { TmdbService } from '../../core/services/tmdb.service';
import { AnalyticsService } from '../../core/services/analytics.service';
 
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly auth             = inject(Auth);
  private readonly authService      = inject(AuthService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly tmdb             = inject(TmdbService);
  private readonly analytics        = inject(AnalyticsService);
  private readonly router           = inject(Router);
 
  readonly user = this.authService.user;
 
  // ── State ──────────────────────────────────────────────
  isLoading        = signal(true);
  isEditingName    = signal(false);
  isSavingName     = signal(false);
  newDisplayName   = '';
  toastMessage     = signal('');
  toastVisible     = signal(false);
 
  // Watchlist stats
  totalMovies    = signal(0);
  watchedMovies  = signal(0);
  totalRatings   = signal(0);
  avgRating      = signal('N/A');
  recentMovies   = signal<any[]>([]);
  topRatedMovies = signal<any[]>([]);
  favoriteGenres = signal<string[]>([]);
 
  // Computed
  unwatchedMovies = computed(() => this.totalMovies() - this.watchedMovies());
  watchedPercent  = computed(() =>
    this.totalMovies() > 0
      ? Math.round((this.watchedMovies() / this.totalMovies()) * 100)
      : 0
  );
 
  ngOnInit(): void {
    this.loadStats();
  }
 
  loadStats(): void {
    this.isLoading.set(true);
    this.watchlistService.getWatchlist().subscribe({
      next: (entries) => {
        this.totalMovies.set(entries.length);
        this.watchedMovies.set(entries.filter(e => e.watched).length);
 
        const rated = entries.filter(e => e.rating);
        this.totalRatings.set(rated.length);
 
        if (rated.length > 0) {
          const avg = rated.reduce((s, e) => s + (e.rating ?? 0), 0) / rated.length;
          this.avgRating.set(avg.toFixed(1));
        }
 
        // Recent — last 6 added
        const recent = [...entries]
          .sort((a, b) => b.addedAt - a.addedAt)
          .slice(0, 6);
        this.recentMovies.set(recent);
 
        // Top rated personal picks
        const topRated = [...entries]
          .filter(e => e.rating)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 6);
        this.topRatedMovies.set(topRated);
 
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
 
  // ── Edit display name ──────────────────────────────────
  startEditName(): void {
    this.newDisplayName = this.user()?.displayName ?? '';
    this.isEditingName.set(true);
  }
 
  cancelEditName(): void {
    this.isEditingName.set(false);
    this.newDisplayName = '';
  }
 
  async saveName(): Promise<void> {
    if (!this.newDisplayName.trim()) return;
    this.isSavingName.set(true);
    try {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: this.newDisplayName.trim(),
        });
        this.showToast('Display name updated ✓');
      }
    } catch {
      this.showToast('Failed to update name');
    } finally {
      this.isSavingName.set(false);
      this.isEditingName.set(false);
    }
  }
 
  // ── Sign out ───────────────────────────────────────────
  async signOut(): Promise<void> {
    await this.authService.signOut();
  }
 
  // ── Navigation ─────────────────────────────────────────
  goToMovie(id: number): void {
    this.router.navigate(['/movie', id]);
  }
 
  goToWatchlist(): void {
    this.router.navigate(['/watchlist']);
  }
 
  // ── Helpers ────────────────────────────────────────────
  getPoster(path: string): string {
    return this.tmdb.getPosterUrl(path, 'w342');
  }
 
  getYear(date: string): string {
    return date ? date.split('-')[0] : '';
  }
 
  getInitials(): string {
    const name = this.user()?.displayName;
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return this.user()?.email?.charAt(0).toUpperCase() ?? 'U';
  }
 
  getMemberSince(): string {
    const created = this.user()?.metadata?.creationTime;
    if (!created) return 'Unknown';
    return new Date(created).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  }
 
  getStars(rating: number): number[] {
    return [1, 2, 3, 4, 5];
  }
 
  private showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 3000);
  }
}
 