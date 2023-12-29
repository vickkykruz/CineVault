import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    return new Promise<boolean>((resolve) => {
      const userCatigory = this.userService.getUserCatigory();

      //! Check if the user is logged in
      if (this.userService.isLogging()) {
        if(userCatigory  === 'admin') {
          resolve(true); //* User is authenicated, continue with navigaion
        }else {
          //* User is not authenicated,redirect to login
          this.userService.userSignOut();
          this.router.createUrlTree(['/admin/auth/login']);
          resolve(false);
        }
      } else {
        //* User is not authenicated,redirect to login
        this.userService.userSignOut();
        this.router.createUrlTree(['/admin/auth/login']);
        resolve(false);
      }
    });
  }
}
