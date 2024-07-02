import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:3000/send-email';

  private handleError(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error');
  }

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, text: string): Promise<any> {
    const body = { to, subject, text };
    return firstValueFrom(
      this.http
        .post(this.apiUrl, body)
        .pipe(
          catchError(this.handleError)
        )
    );
  }
  
}
