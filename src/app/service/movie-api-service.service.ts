import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieApiServiceService {

  constructor(private http: HttpClient) { }

  baseUrl = "https://api.themoviedb.org/3";
  apiKey = "08cc33bd5ae3a747598ce2ad84376e66";

  bannerApiData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/all/week?api_key=${this.apiKey}`)
  }

  // TreadingMoviesApi
  trendingMoviesApi(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}`);
  }

  // SearchMovie
  getSearchMovie(data:any): Observable<any> {
    console.log(data);
    return this.http.get(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${data}`)
  }
}
