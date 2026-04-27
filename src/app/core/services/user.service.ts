import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
 
export interface CineVaultUser {
  uid:         string;
  displayName: string;
  email:       string;
  photoURL:    string;
  createdAt:   number;
  lastSeen:    number;
}
 
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly firestore = inject(Firestore);
  private readonly auth      = inject(Auth);
  private readonly injector  = inject(EnvironmentInjector);
 
  // ── Create or update user doc on login ─────────────────
  async syncUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
 
    const ref  = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(ref);
 
    if (!snap.exists()) {
      // First time — create full user document
      await setDoc(ref, {
        uid:         user.uid,
        displayName: user.displayName ?? '',
        email:       user.email ?? '',
        photoURL:    user.photoURL ?? '',
        createdAt:   Date.now(),
        lastSeen:    Date.now(),
      });
    } else {
      // Returning user — update lastSeen
      await updateDoc(ref, {
        lastSeen:    Date.now(),
        displayName: user.displayName ?? '',
        photoURL:    user.photoURL ?? '',
      });
    }
  }
}
 