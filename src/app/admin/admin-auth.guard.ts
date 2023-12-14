import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

      if (isAuthenticated) {
        resolve(true); // User is authenicated, continue with navigaion
      } else {
        // User is not authenicated,redirect to login
        this.router.navigate(['/admin/auth/login']);
        resolve(false);
      }
    });
  }
}
