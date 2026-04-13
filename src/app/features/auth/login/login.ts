import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
 
type AuthMode = 'login' | 'register';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
 
  mode = signal<AuthMode>('login');
  isLoading = signal(false);
  errorMessage = signal('');
 
  email = '';
  password = '';
  displayName = '';
 
  readonly filmCells = Array.from({ length: 20 }, (_, i) => i);
  readonly filmColors = [
    'linear-gradient(145deg,#1a0a00,#6b3a00)',
    'linear-gradient(145deg,#001020,#003060)',
    'linear-gradient(145deg,#100010,#400040)',
    'linear-gradient(145deg,#001a00,#004d00)',
    'linear-gradient(145deg,#1a0000,#5c0000)',
    'linear-gradient(145deg,#0a0a1a,#2a2a6b)',
    'linear-gradient(145deg,#1a1000,#5c4000)',
    'linear-gradient(145deg,#001a1a,#004d4d)',
  ];
 
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
      'auth/user-not-found':      'No account found with this email.',
      'auth/wrong-password':      'Incorrect password. Try again.',
      'auth/email-already-in-use':'An account with this email already exists.',
      'auth/weak-password':       'Password must be at least 6 characters.',
      'auth/invalid-email':       'Please enter a valid email address.',
      'auth/too-many-requests':   'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user':'Sign in was cancelled.',
    };
    return errors[code] ?? 'Something went wrong. Please try again.';
  }
}
 