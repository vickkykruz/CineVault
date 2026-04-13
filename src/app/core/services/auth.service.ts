import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, Observable } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
 
  // Reactive user state as a signal — use anywhere in the app
  readonly user = toSignal(user(this.auth), { initialValue: null });
 
  // ── Google Sign In ─────────────────────────────────────────
  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(this.auth, provider);
    await this.router.navigate(['/']);
  }
 
  // ── Email & Password ───────────────────────────────────────
  async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/']);
  }
 
  async registerWithEmail(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/']);
  }
 
  // ── Sign Out ───────────────────────────────────────────────
  async signOut(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/auth/login']);
  }
 
  // ── Helpers ────────────────────────────────────────────────
  isLoggedIn(): boolean {
    return !!this.user();
  }
 
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
 
  getIdToken(): Observable<string> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    return from(currentUser.getIdToken());
  }
}
 