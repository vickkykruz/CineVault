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
    console.error('A Http error occured in the MovieAPI: ', error );
    return throwError(error);
  }

  baseUrl = 'https://api.themoviedb.org/3';
  altBaseUrl = 'https://imdb-api.com/en/API/';
  apiKey = '08cc33bd5ae3a747598ce2ad84376e66';
  altApiKey = 'k_w6zpo7f7';

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

  imdbTrendingMoivesApi(): Observable<any> {
    return this.http
    .get(`${this.altBaseUrl}MostPopularMovies/${this.altApiKey}`)
    .pipe(catchError(this.handleError));
  }

  // SearchMovie
  getSearchMovie(data: any): Observable<any> {
    console.log(`Search data: ${data}`);
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
    return this.http
	  .get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=28`)
	  .pipe(catchError(this.handleError));
  }

  // Adventure
  getAdventureMovies(): Observable<any> {
    return this.http
	  .get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=12`)
	  .pipe(catchError(this.handleError));
  }

  // Animation
  getAnimationMovies(): Observable<any> {
    return this.http
	  .get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=16`)
	  .pipe(catchError(this.handleError));
  }

  // Comedy
  getComedyMovies(): Observable<any> {
    return this.http
	  .get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=35`)
	  .pipe(catchError(this.handleError));
  }

  // Documentary
  getDocumentaryMovies(): Observable<any> {
    return this.http
	  .get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=99`)
	  .pipe(catchError(this.handleError));
  }

  // Sci-Fi
  getSciFiMovies(): Observable<any> {
    return this.http
	  .get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=878`)
	  .pipe(catchError(this.handleError));
  }

  // Thriller
  getThrillerMovies(): Observable<any> {
    return this.http
	  .get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=53`)
	  .pipe(catchError(this.handleError));
  }
}
