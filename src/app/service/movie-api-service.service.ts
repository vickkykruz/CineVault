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

  // Get the movie data from the server
  baseUrl = 'http://localhost:3000';
  
  // Fetch movie data from the server
  fetchMovies(endpoint: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/movies/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  // Fetch banner data
  bannerApiData(): Observable<any> {
    return this.fetchMovies('banner');
  }

  // Trending movies
  trendingMoviesApi(): Observable<any> {
    return this.fetchMovies('trending');
  }
  
  // Action movies
  getActionMovies(): Observable<any> {
    return this.fetchMovies('action');
  }
  
  // Adventure movies
  getAdventureMovies(): Observable<any> {
    return this.fetchMovies('adventure');
  }

  // Animation movies
  getAnimationMovies(): Observable<any> {
    return this.fetchMovies('animation');
  }

  // Comedy movies
  getComedyMovies(): Observable<any> {
    return this.fetchMovies('comedy');
  }

  // Documentary movies
  getDocumentaryMovies(): Observable<any> {
    return this.fetchMovies('documentary');
  }

  // Sci-Fi movies
  getSciFiMovies(): Observable<any> {
    return this.fetchMovies('scifi');
  }

  // Thriller movies
  getThrillerMovies(): Observable<any> {
    return this.fetchMovies('thriller');
  }

// Fetch movies by genre
  getMoviesByGenre(genre: string): Observable<any> {
    return this.fetchMovies(genre.toLowerCase());
  }

  // Search movies
  getSearchMovie(query: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/search/movie?query=${query}`)
      .pipe(catchError(this.handleError));
  }

  // Get movie details
  getMovieDetails(movieId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/movie/details/${movieId}`)
      .pipe(catchError(this.handleError));
  }

  // Get movie trailler video
  getMovieVideo(movieId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/movie/video/${movieId}`)
      .pipe(catchError(this.handleError));
  }

  // Get movie cast
  getMovieCast(movieId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/movie/cast/${movieId}`)
      .pipe(catchError(this.handleError));
  }
}
