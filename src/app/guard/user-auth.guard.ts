import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService) {}

  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {

      const userCatigory = this.userService.getUserCatigory();

      //! Check if the user is logged in
      if(this.userService.isLogging()) {
        if(userCatigory  === 'users') {
          resolve(true); //* User is authenicated, continue with navigaion
        }else {
          //* User is not authenicated,redirect to login
          sessionStorage.clear();
          this.router.navigate(['/auth/login']);
          resolve(false);
        }
      }else {
        this.router.navigate(['/auth/login']);
        resolve(false);
      }
    })
  }

}
