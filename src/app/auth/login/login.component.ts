import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthService } from 'src/app/service/auth.service';
import { take, timer } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { child, get, getDatabase, ref } from 'firebase/database';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userInfo: Auth = {
    email: '',
    password: ''
  }
  isProcessing: boolean = false;

  message!:string;
  ValidateForm!: boolean;
  defaultError = {
    'display' : 'none'
  }

  constructor(
    private router: ActivatedRoute,
    private moveRoute: Router,
    private fireauth: AngularFireAuth,
    private authService: AuthService,
    private userService: UserService,
    private _snackbar: MatSnackBar,
    private title: Title) {}
  private db = getDatabase();
  private displaySnackBar(message: string) {
    this._snackbar.open(message, "Close", {
      duration: 3500,
    });
  }

  private showProcessingMessage() {
    this._snackbar.open("Processing...", "", {
      duration: 2500,
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Cruz Tv || Login');
  }

  id: any = this.router.snapshot.paramMap.get('id');
  feedback!: any;
  user: any;
  submitForm() {
    //* Preventing the function from continuing futher if the processing is true to avoid conflict
    if (this.isProcessing) {
      return;
    }

    //* Disable the formand showing procaessing meassage
    this.isProcessing = true;
    this.showProcessingMessage();

    this.fireauth.signInWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
    .then((userCredentials) => {

      // Get the user ID and lastSignDate
      const userID: string | undefined = userCredentials.user?.uid;
      const lastSignIn: any  = userCredentials.user?.metadata.lastSignInTime;

      if (userID !== undefined) {
        //* Fetch and undate the lastLogin
        const dbRef = ref(this.db);
        get(child(dbRef, `users\${userID}`)).then((snapshot) => {
          if (snapshot.exists()) {
            // Upadet the lastSignIN
            const table = "users";
            this.userService.updateAdminLastSignIn(table, userID, lastSignIn).then(() => {
              // Activate Login Session
              sessionStorage.setItem('SSID', userID);
              sessionStorage.setItem('isAuthenticated', 'true');
              sessionStorage.setItem('userCatigory', 'user');
              this.displaySnackBar("Welcome"); // Give the user a message
              this.isProcessing = false;
              if (this.id != null){ 
                this.moveRoute.navigate([`/download/${this.id}`]);
              }else {
                this.moveRoute.navigate(['/home']);
              }
            })
            .catch((err) => {
              this.displaySnackBar("Error: Login session failed");
              this.isProcessing = false;
            })
          }else {
            this.displaySnackBar("Error: Record not found");
            this.isProcessing = false;
          }
        })
      }else {
        this.displaySnackBar("Error: Unable to get record");
        this.isProcessing = false;
      }
    })
    .catch((err) => {
      this.displaySnackBar("Error: Unable to connect...");
      this.isProcessing = false;
    });
  }
}
