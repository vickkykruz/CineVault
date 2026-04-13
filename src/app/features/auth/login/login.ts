import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TmdbService } from '../../../core/services/tmdb.service';
 
type AuthMode = 'login' | 'register';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly tmdb = inject(TmdbService);
 
  mode = signal<AuthMode>('login');
  isLoading = signal(false);
  errorMessage = signal('');
 
  email = '';
  password = '';
  displayName = '';
 
  // Poster columns
  columnA = signal<string[]>([]);
  columnB = signal<string[]>([]);
 
  ngOnInit(): void {
    this.loadPosters();
  }
 
  loadPosters(): void {
    this.tmdb.getPopular(1).subscribe({
      next: (res) => {
        const posters = res.results
          .filter((m) => m.poster_path)
          .map((m) => this.tmdb.getPosterUrl(m.poster_path, 'w342'));
        this.columnA.set([...posters.slice(0, 10), ...posters.slice(0, 10)]);
      },
    });
 
    this.tmdb.getPopular(2).subscribe({
      next: (res) => {
        const posters = res.results
          .filter((m) => m.poster_path)
          .map((m) => this.tmdb.getPosterUrl(m.poster_path, 'w342'));
        this.columnB.set([...posters.slice(0, 10), ...posters.slice(0, 10)]);
      },
    });
  }
 
  toggleMode(): void {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.errorMessage.set('');
    this.email = '';
    this.password = '';
    this.displayName = '';
  }
 
  async signInWithGoogle(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      await this.authService.signInWithGoogle();
    } catch (err: any) {
      this.errorMessage.set(this.parseError(err.code));
    } finally {
      this.isLoading.set(false);
    }
  }
 
  async submitForm(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      if (this.mode() === 'login') {
        await this.authService.signInWithEmail(this.email, this.password);
      } else {
        await this.authService.registerWithEmail(this.email, this.password);
      }
    } catch (err: any) {
      this.errorMessage.set(this.parseError(err.code));
    } finally {
      this.isLoading.set(false);
    }
  }
 
  private parseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/user-not-found':       'No account found with this email.',
      'auth/wrong-password':       'Incorrect password. Try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password':        'Password must be at least 6 characters.',
      'auth/invalid-email':        'Please enter a valid email address.',
      'auth/too-many-requests':    'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign in was cancelled.',
    };
    return errors[code] ?? 'Something went wrong. Please try again.';
  }
}
 