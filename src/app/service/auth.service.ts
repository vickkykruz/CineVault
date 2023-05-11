import { Injectable } from '@angular/core';
import {
  updateProfile,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireStore: Firestore,
  ) { }

  // Crate a Function to store the data to a session
  private readonly key: string = 'data';
  saveDataInSessionStorage(array: any[]) {
    sessionStorage.setItem(this.key, JSON.stringify(array));
  }

  // Get the session data
  getArrayDataInSessionStorage(): any[] | null {
    const storedData = sessionStorage.getItem(this.key);
    return (storedData) ? JSON.parse(storedData) : null;
  }

  arrayExistsInSessionStorage(): boolean {
    return (this.getArrayDataInSessionStorage() !== null) ? true : false;
  }

  async insertUsernameToField(data:any, username: any) {
    if(!username) {
      alert("No Username!!!.");
    };
    try {
      await updateProfile(data, {displayName: username});
      await this.storeDataOfUser(data);
    }
    catch {
      alert("Falied To Update Username");
    }
  }

  async storeDataOfUser(data:any) {
    const ref = doc(this.fireStore, `users/${data.uid}`);
    const UserData: any = {
      name: data.displayName,
      email: data.email,
      photoUrl: data.photoURL
    };

    try {
      await setDoc(ref, UserData, {merge: true});
    }
    catch {
      alert("Failed o process");
    }
  }

  sendVerificationEmail(user: any, username?: any) {
    user // Send a verfication Mail To user
      .sendEmailVerification()
      .then(() => {
        this.insertUsernameToField(user, username);
      })
      .catch(() => console.log("Error: Failed to send verified email"));
  };

  // auth: any = getAuth();
  // userEffect() {
  //   this.auth.onAuthStateChanged( (data: boolean)=> {
  //     if (data)
  //     {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // }
}




