import { Injectable } from '@angular/core';
import {
  updateProfile,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireStore: Firestore,
  ) { }

  // Shae Data
  private isCheckedSubject = new BehaviorSubject<boolean>(true);

  set isChecked(value: boolean) {
    this.isCheckedSubject.next(value);
  }

  get isChecked$() {
    return this.isCheckedSubject.asObservable();
  }


  // Crate a Function to store the data to a session
  private readonly key: string = 'data';
  saveDataInSessionStorage(array: any[]) {
    sessionStorage.setItem(this.key, JSON.stringify(array));
  }

  removeDataInSession(): any {
    return sessionStorage.removeItem(this.key);
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

 // Fetch User Identity
//  app = initializeApp(firebas);
 db = getFirestore();

 async fetctdata(docKey: any) {
  const docRef = doc(this.db, "users", docKey);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      throw new Error("No such documents!");
    }
  } catch (error) {
    throw error;
  }

 }

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




