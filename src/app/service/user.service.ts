import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from '@angular/fire/auth';
import { DatabaseReference, child, get, getDatabase, ref, set, update } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDertail } from './userdetails';
import { Subscription, Unsubscribable } from 'rxjs';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: any;
  // private authSubscription: Subscription | Unsubscribable | null = null;
  private db = getDatabase();
  private userKeys: UserDertail = {
    uid: "",
    lastSign: "",
    displayName: "",
    email: "",
    emailVaildation: false,
    phoneNo: null,
    photoURL: null,
    createdTime: "",
    authStatus: false
  }
  private loginSubject!: string;
  private loginBoday!: string;
  private registerSubject!: string;
  private registerBoday!: string;  

  constructor(
    private fireauth: Auth,
    private _snackbar: MatSnackBar,
	private emailservice: EmailService,
    ) {
       this.fireauth.onAuthStateChanged((user) => {
        this.user = user;
        console.warn('Authentication state changed:', this.user);
      })
    }

  private auth = this.fireauth;

  //* Initializaed the User
  private async initializeUser() {
    // Wait for the inital authenication state to be recieved
    await new Promise<void>((resolve) => {
      if(this.user !== null) {
        resolve();
      } else {
        const sub = this.fireauth.onAuthStateChanged((user) => {
          if (user !== null) {
            resolve();
          }
        });
      }
    });
    this.user = this.fireauth.currentUser; //* Get the authenicated User
  }

  //* Refresh Users (user & admin) access token
  private async refreshAuthToken(): Promise<void> {
    try {
      await this.initializeUser(); //* Call the initialzedUser
      if (this.user !== null) {
        await this.user.getIdToken(true); }else { throw Error}
    } catch (error) { throw error; }
  }

  private updateAdminLastSignIn(table: string, userId: string, nwLastSignIN: string): Promise<void> {
    //* Update the value
    const updates: Record<string, any> = {};
    updates[`/${table}/${userId}/lastSignIn`] = nwLastSignIN;
    //* Perform the action
    return update(ref(this.db) as DatabaseReference, updates);
  }

  //* Update the User Auth status  from the backend
  private updateAuthStatus(table: string, userId: string, status: boolean): Promise<void> {
    return new Promise<void> (async(resolve) => {
      //* Update the value
      await this.refreshAuthToken();
      const updates: Record<string, any> = {};
      updates[`/${table}/${userId}/authStatus`] = status;
      //* Perform the action
      update(ref(this.db) as DatabaseReference, updates).then(() => {
        resolve(); }).catch(() => {
        console.warn("Error: Failed to update Auth Status");
      });
    });
  }

  private fetchAndUpadteLastSignIn(table: string, userId: string, lastSignIn: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dbRef = ref(this.db);
      get(child(dbRef, `${table}/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.updateAdminLastSignIn(table, userId, lastSignIn).then(() => {
            resolve();
          }).catch(() => {
            reject('Internal Error: Failed to update');
          });
        }else {
          reject('Internal Error: Rocord not found');
        }
      }).catch(() => {
        reject('Internal Error: Failed to fetch record');
      });
    });
  }

  isLogging(): boolean | any {
    //* Session check if your are previously availabled
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    //* Return true else false
    return (isAuthenticated) ? true : false;
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
        //* Update the ServerAuth Status
        const table = this.getUserCatigory();
        const SSID = sessionStorage.getItem('SSID');
        if (table !== null && SSID !== null) {
          this.updateAuthStatus(table, SSID, false).then(() => {
            console.log("Successfully edited the auth status");
          }).catch(() => { console.warn("Failed to edit the auth status"); })
        }

        //* Remove the sessions
        sessionStorage.removeItem('SSID');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userCatigory');
        //* Resolve the Promise
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
        //* CHECK IF THE USER ALREADY SIGN IN
        if (userCredentials !== null) {
          this.userKeys.uid = userCredentials.user?.uid;
          this.userKeys.lastSign = userCredentials.user?.metadata.lastSignInTime;

          // Condition to Check if the userId is undefined
          if (this.userKeys.uid !== undefined) {
            this.fetchAndUpadteLastSignIn(table, this.userKeys.uid, this.userKeys.lastSign)
            .then(() => {
			  
			  // Email Template
			  this.loginSubject = `LOGIN NOTIFICATION`;
			  this.loginBoday = `Hey ${email}.
				You have just loggin at ${this.userKeys.lastSign}. If not you, kindly send us a mail at info@cruztv.com.
				Thank you.`;
			  // Send mail
			  this.emailservice.sendEmail(email, this.loginSubject, this.loginBoday)
			  .then(() => {
				
				// Activate the sessions
				sessionStorage.setItem('SSID', this.userKeys.uid || "undefined"); 
				sessionStorage.setItem('isAuthenticated', 'true');
				sessionStorage.setItem('userCatigory', table);
				resolve();
			  }) .catch(() => {
				reject('Internal Error: An error occured'); });
				
            }) .catch(() => {
              reject('Internal Error: Fetch and update failed'); });
          }else {
            reject('Warning: Invaild user data');
          }
        }else {
          reject("Error: No records found");
        }
      })
      .catch(() => {
        reject('Error: Invaild Credential. Try again');
      });
    });
  }

  private sendEmailVerificationToUser(user: User): Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      sendEmailVerification(user).then(() => {
        resolve();
      })
      .catch(() => {
        reject('Error: Failed to verfied email address')
      })
    })
  }

  //* Insert New User Record to database with the auth == true
  private insertNewUserRecord(table: string, username: string | undefined, userCredentials: any): Promise<void>{
    return new Promise<void> ((resolve, reject) => {
      this.userKeys.email = userCredentials.user?.email;
      this.userKeys.emailVaildation = userCredentials.user.emailVerified;
      this.userKeys.uid = userCredentials.user.uid;
      this.userKeys.lastSign = userCredentials.user?.metadata.lastSignInTime;
      this.userKeys.createdTime = userCredentials.user?.metadata.creationTime;
      this.userKeys.phoneNo = null;
      this.userKeys.photoURL = null;
      this.userKeys.authStatus = true;

      if (this.userKeys.uid !== undefined) {
        set(ref(this.db, table + "/" + this.userKeys.uid), {
          displayName: username,
          email: this.userKeys.email,
          emailVaildation: this.userKeys.emailVaildation,
          phoneNumber: this.userKeys.phoneNo,
          photoURL: this.userKeys.photoURL,
          lastSign: this.userKeys.lastSign,
          createdTime: this.userKeys.createdTime,
          authStatus: this.userKeys.authStatus
        })
        .then(() => {
          if (this.userKeys.uid !== undefined) {
            sessionStorage.setItem('SSID', this.userKeys.uid);
          }else {
            sessionStorage.setItem('SSID', "undefined");
          }
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userCatigory', table);
          resolve();
        })
        .catch(() => {
          reject("Error: Failed to insert records");
        });
      }
    })
  }

  // * Userdate the server profile
  private updateUserUsername(username: string | undefined): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      await this.initializeUser();
      if (this.user) {
        updateProfile(this.user, {
          displayName: username
        }).then(() => { resolve(); }).catch(() => {
          reject("Error: Server Error (Username)");
        });
      }
    });
  }

  //* Create user with email and password
  createUserWihEmailAndPassword(table: string, username: string | undefined, email: string, password: string): Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      createUserWithEmailAndPassword(this.fireauth, email, password)
        .then((userCredentials) => {
          //* If the current Auth user is not null
          if (userCredentials !== null) {
            //* Send the Verfication email
            this.sendEmailVerificationToUser(userCredentials.user)
            .then(() => {
              // console.log(userCredentials.user);
              //* Update the username to the server
              this.updateUserUsername(username).then(() => {
                //* Insert the new record
                this.insertNewUserRecord(table, username, userCredentials).then(() => {
                  resolve(); }).catch((err) => {reject(err); }); }).catch((err) => {
                reject(err); }); }).catch((err) => { reject(err); });
          }else {
            reject("Error: Internal Error (User)");
          }
        })
        .catch(() => {
          reject("Error: Unable to create new user");
        });
    });
  }
}
