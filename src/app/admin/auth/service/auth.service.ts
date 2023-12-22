import { Injectable } from '@angular/core';
import { DatabaseReference, child, get, getDatabase, ref, update } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'loginAttempts';
  private readonly LAST_RESET_KEY = 'lastReset';
  private db = getDatabase(); // Connect to the database

  constructor() {
  }

  private checkReset(): void {
    const lastReset = localStorage.getItem(this.LAST_RESET_KEY);
    const currentTime = new Date().getTime();

    if (!lastReset || currentTime - parseInt(lastReset, 10) >= 24 * 60 * 60 * 1000) {
      // Reset attempt and update timestamp
      localStorage.setItem(this.STORAGE_KEY, '0');
      localStorage.setItem(this.LAST_RESET_KEY, currentTime.toString());
    }
  }

  getLoginAttempts(): number {
    this.checkReset(); // check and reset if 24 hours have passed;
    const storedAttempts = localStorage.getItem(this.STORAGE_KEY);
    return storedAttempts ? parseInt(storedAttempts, 10) : 0;
  }

  incrementLoginAttempts(): void {
    this.checkReset(); // checks and reset if 24 hrs have passed
    const currentAttempts = this.getLoginAttempts() + 1;
    localStorage.setItem(this.STORAGE_KEY, currentAttempts.toString());
  }

  getAdminDetails(): any {
    const dbRef = ref(this.db);
    const adminID = sessionStorage.getItem('SSID');
    return get(child(dbRef, 'admin/' + adminID)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    })
  }
}
