import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, updateProfile } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import { TmdbService } from '../../core/services/tmdb.service';
import { AnalyticsService } from '../../core/services/analytics.service';
 
interface WatchlistEntry {
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
 
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly auth             = inject(Auth);
  private readonly firestore        = inject(Firestore);
  private readonly authService      = inject(AuthService);
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
 
  // Watchlist data
  allMovies      = signal<WatchlistEntry[]>([]);
  recentMovies   = signal<WatchlistEntry[]>([]);
  topRatedMovies = signal<WatchlistEntry[]>([]);
 
  // Computed stats
  totalMovies     = computed(() => this.allMovies().length);
  watchedMovies   = computed(() => this.allMovies().filter(m => m.watched).length);
  unwatchedMovies = computed(() => this.totalMovies() - this.watchedMovies());
  totalRatings    = computed(() => this.allMovies().filter(m => m.rating).length);
  avgRating       = computed(() => {
    const rated = this.allMovies().filter(m => m.rating);
    if (!rated.length) return 'N/A';
    return (rated.reduce((s, m) => s + (m.rating ?? 0), 0) / rated.length).toFixed(1);
  });
  watchedPercent = computed(() =>
    this.totalMovies() > 0
      ? Math.round((this.watchedMovies() / this.totalMovies()) * 100)
      : 0
  );
 
  ngOnInit(): void {
    this.loadStats();
  }
 
  // ── Load directly from Firestore using getDocs ─────────
  async loadStats(): Promise<void> {
    this.isLoading.set(true);
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      this.isLoading.set(false);
      return;
    }
 
    try {
      const ref      = collection(this.firestore, `watchlists/${uid}/movies`);
      const snapshot = await getDocs(ref);
      const entries  = snapshot.docs.map(d => d.data() as WatchlistEntry);
 
      this.allMovies.set(entries);
 
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
 
    } catch (err) {
      console.error('Failed to load profile stats', err);
    } finally {
      this.isLoading.set(false);
    }
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
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return this.user()?.email?.charAt(0).toUpperCase() ?? 'U';
  }
 
  getMemberSince(): string {
    const created = this.user()?.metadata?.creationTime;
    if (!created) return 'Unknown';
    return new Date(created).toLocaleDateString('en-GB', {
      month: 'long',
      year:  'numeric',
    });
  }
 
  getStars(rating: number = 0): number[] {
    return [1, 2, 3, 4, 5];
  }
 
  private showToast(message: string): void {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 3000);
  }
}
 