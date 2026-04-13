import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
 
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { tmdbInterceptor } from './core/interceptors/tmdb.interceptor';
import { appApiInterceptor } from './core/interceptors/app-api.interceptor';
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
 
    // HTTP client with both interceptors
    provideHttpClient(
      withInterceptors([tmdbInterceptor, appApiInterceptor])
    ),
 
    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
