import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieApiServiceService {
  constructor(
    private http: HttpClient  ) {}

  private handleError(error: HttpErrorResponse) {
    // error.status
    // return error.error;
    return throwError(error);
  }

  baseUrl = 'https://api.themoviedb.org/3';
  apiKey = '08cc33bd5ae3a747598ce2ad84376e66';

  bannerApiData(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/trending/all/week?api_key=${this.apiKey}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // TreadingMoviesApi
  trendingMoviesApi(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}`)
      .pipe(catchError(this.handleError));
  }

  // SearchMovie
  getSearchMovie(data: any): Observable<any> {
    console.log(data);
    return this.http
      .get(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${data}`)
      .pipe(catchError(this.handleError));
  }

  // Get Movie Dtails
  getMovieDetails(data: any): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/movie/${data}?api_key=${this.apiKey}`)
      .pipe(catchError(this.handleError));
  }

  // Get ovie Video
  getMovieVideo(data: any): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/movie/${data}/videos?api_key=${this.apiKey}`)
      .pipe(catchError(this.handleError));
  }

  getMovieCast(data: any): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/movie/${data}/credits?api_key=${this.apiKey}`)
      .pipe(catchError(this.handleError));
  };

  // Action
  getActionMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=28`);
  }

  // Adventure
  getAdventureMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=12`);
  }

  // Animation
  getAnimationMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=16`);
  }

  // Comedy
  getComedyMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=35`);
  }

  // Documentary
  getDocumentaryMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=99`);
  }

  // Sci-Fi
  getSciFiMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=878`);
  }

  // Thriller
  getThrillerMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=53`);
  }
}
