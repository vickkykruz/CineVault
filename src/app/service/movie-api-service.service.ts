import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry, throwError } from 'rxjs';
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserDertail } from './userdetails';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import 'firebase/database';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class MovieApiServiceService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private fireAuth: AngularFireAuth,
    private fireStore: Firestore,
    private db: AngularFireDatabase
  ) {}

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
  }

  auth: any = getAuth();
  sendVerificationEmail(user: any, id: any, username?: string, storData?: UserDertail | any) {
    user
      .sendEmailVerification()
      .then(() => {

        if (username) {
          updateProfile(user, {
            displayName: username
          })
          .then(()=> {

            storData.id = doc(collection(this.fireStore, 'id')).id;
            addDoc(collection(this.fireStore, 'User'),storData)




            // // Store Key For Retriever
            // localStorage.setItem('token', user.uid);

            // // Save Data into The Database
            // this.db.object('users/0').set({id: 1, uid: user.uid, name: user.displayName, email:user.email, avater:user.photoURL});

            // // Check it the navigation is on a movie page
            // if (id != null) {
            //   this.router.navigate([`/movie/${id}`]);
            // } else {
            //   this.router.navigate(['/home']);
            // }
          })
          .catch(()=> console.log("Failed To Update user displaName"))
        }

      })
      .catch(() => console.log("Error: Failed to send verified email"));
  }

  userEffect() {
    this.auth.onAuthStateChanged( (data: boolean)=> {
      if (data)
      {
        return true;
      } else {
        return false;
      }
    });
  }
}
