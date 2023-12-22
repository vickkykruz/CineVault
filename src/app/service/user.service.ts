import { Injectable } from '@angular/core';
import { Auth, User, getAuth, signInWithEmailAndPassword, signOut, updatePassword } from '@angular/fire/auth';
import { DatabaseReference, child, get, getDatabase, ref, update } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fireauth: Auth,
    private _snackbar: MatSnackBar,
    ) { }

  private auth = getAuth();
  private user = this.auth.currentUser; //* Get the authenicated User
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

    //* The Observer check If the current user is signed in
    if (this.user) {
      //* Session check if your are previously availabled
      const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      //* Return true else false
      return (isAuthenticated) ? true : false;
    }else {
      return false;
    }
  }

  displaySnackBar(message: string) {
    this._snackbar.open(message, "Close", {
      duration: 3500,
    });
  }

  showProcessingMessage() {
    this._snackbar.open("Processing...", "", {
      duration: 2500,
    });
  }

  getUserCatigory(): string | null {
    return sessionStorage.getItem('userCatigory');
  }

  getCurrentUserProfie(): Promise<User | null> {
    return new Promise(resolve => {
      if (this.user !== null) {
        resolve(this.user);
      }else {
        resolve(null);
      }
    });
  }

  // Update user password
  updateUserPassword(newPassword: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.user) {
        updatePassword(this.user, newPassword)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject('Error: Failed to update password');
        });
      }else {
        reject('Error: User not found');
      }
    });
  }

  // SignOut the user
  userSignOut(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      signOut(this.auth)
      .then(() => {
        // Remove the sessions
        sessionStorage.removeItem('SSID');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userCatigory');

        // Resolve the Promise
        resolve();
      })
      .catch(() => {
        reject('Error: Failed to signout');
      });
    });
  }

  // Create a sign service
  siginWithEmailAndPassword(table: string, email: string, password: string): Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      signInWithEmailAndPassword(this.fireauth, email, password)
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
