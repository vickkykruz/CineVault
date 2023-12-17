import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DatabaseReference, child, get, getDatabase, ref, update } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fireauth: AngularFireAuth,
    ) { }

  private db = getDatabase();

  private updateAdminLastSignIn(table: string, userId: string, nwLastSignIN: string): Promise<void> {
    //* Update the value
    const updates: Record<string, any> = {};
    updates[`/${table}/${userId}/lastSignIn`] = nwLastSignIN;
    //* Perform the action
    return update(ref(this.db) as DatabaseReference, updates);
  }

  private fetchAndUpadteLastSignIn(table: string, userId: string, lastSignIn: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dbRef = ref(this.db);
      get(child(dbRef, `${table}/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.updateAdminLastSignIn(table, userId, lastSignIn)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject('Internal Error: Failed to update');
          })
        }else {
          reject('Internal Error: Rocord not found');
        }
      })
      .catch(() => {
        reject('Internal Error: Failed to fetch record');
      });
    });
  }

  isLogging(): boolean {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    //* Return true else false
    return (isAuthenticated) ? true : false;
  }

  getUserCatigory(): string | null {
    return sessionStorage.getItem('userCatigory');
  }

  // Create a sign service
  siginWithEmailAndPassword(table: string, email: string, password: string): Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      this.fireauth.signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const userId: string | undefined = userCredentials.user?.uid;
        const lastSign: any = userCredentials.user?.metadata.lastSignInTime;

          // Condition to Check if the userId is undefined
          if (userId !== undefined) {
            this.fetchAndUpadteLastSignIn(table, userId, lastSign)
            .then(() => {
              // Activate the sessions
              sessionStorage.setItem('SSID', userId);
              sessionStorage.setItem('isAuthenticated', 'true');
              sessionStorage.setItem('userCatigory', table);

              // Resolve the Promise
              resolve();
            })
            .catch(() => {
              reject('Internal Error: Fetch and update failed');
            });
          }else {
            reject('Warning: Invaild user data');
          }
      })
      .catch(() => {
        reject('Error: Authenication service failed');
      });
    });
  }
}
