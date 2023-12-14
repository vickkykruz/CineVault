import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'loginAttempts';

  constructor() { 
  }

  getLoginAttempts(): number {
    const storedAttempts = localStorage.getItem(this.STORAGE_KEY);
    return storedAttempts ? parseInt(storedAttempts, 10) : 0;
  }

  incrementLoginAttempts(): void {
    const currentAttempts = this.getLoginAttempts() + 1;
    localStorage.setItem(this.STORAGE_KEY, currentAttempts.toString());
  }

}
