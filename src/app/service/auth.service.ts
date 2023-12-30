import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireauth: Auth,
  ) { }

  signInWithGoogle(): Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      const provider = new GoogleAuthProvider();
      // Add the scope
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      // Force the user to select an account every time the login
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      // To apply the default browser preference
      this.fireauth.useDeviceLanguage();

      // * Call the function
      signInWithPopup(this.fireauth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.warn("Credentials:", credential);
        // Access Token
        const token = credential?.accessToken;
        console.warn("Access Token", token);
        // User Info
        const user = result.user;
        console.warn("User Info: ", user);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    })
  }
}
