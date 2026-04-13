import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
 
export const appApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept your own API requests
  if (!req.url.startsWith(environment.appApiUrl)) {
    return next(req);
  }
 
  const auth = inject(Auth);
  const user = auth.currentUser;
 
  if (!user) {
    return next(req);
  }
 
  return from(user.getIdToken()).pipe(
    switchMap((token) => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return next(authReq);
    })
  );
};
 