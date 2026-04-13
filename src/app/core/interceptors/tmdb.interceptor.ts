import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
 
export const tmdbInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept TMDB requests
  if (!req.url.startsWith(environment.tmdbBaseUrl)) {
    return next(req);
  }
 
  const tmdbReq = req.clone({
    setParams: {
      api_key: environment.tmdbApiKey,
      language: 'en-US',
    },
  });
 
  return next(tmdbReq);
};
