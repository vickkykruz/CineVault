import { Injectable } from '@angular/core';
import { DatabaseReference, getDatabase, ref, update } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private db = getDatabase();

  updateAdminLastSignIn(table: string, adminID: string, nwLastSignIN: string) {
    //* Update the value
    const updates: Record<string, any> = {};
    updates[`/${table}/${adminID}/lastSignIn`] = nwLastSignIN;
    //* Perform the action
    return update(ref(this.db) as DatabaseReference, updates);
  }

  isLogging(): boolean {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    //* Return true else false
    return (isAuthenticated) ? true : false;
  }

  getUserCatigory(): string | null {
    return sessionStorage.getItem('userCatigory');
  }
}
