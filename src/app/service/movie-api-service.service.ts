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
        // retry(3),
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
}
