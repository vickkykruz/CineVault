import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Auth } from 'src/app/auth/auth';
import { AuthService } from '../auth.service';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{

  // Define the login Attempts
  loginAttempts: number = 0;
  maxAttempts: number = 4;
  isProcessing: boolean = false;

  userInfo: Auth = {
    email: '',
    password: ''
  }

  constructor (
    private fireauth: AngularFireAuth,
    private authService: AuthService,
    private userService: UserService,
    private _snackbar: MatSnackBar,
    private router: Router,
    private title: Title
    ) {}

  private getLoginAttempts() {
    this.loginAttempts = this.authService.getLoginAttempts();
  }
  private db = getDatabase();
  private displaySnackBar(message: string) {
    this._snackbar.open(message, "Close", {
      duration: 3500,
    });
  }
  private readonly STORAGE_KEY = 'loginAttempts';
  private showProcessingMessage() {
    this._snackbar.open("Processing...", "", {
      duration: 2500,
    });
  }

  ngOnInit(): void {
      this.title.setTitle("CruzTv || Adminstartion Portal");
      this.getLoginAttempts();
  }



  // Sign Function
  submitForm() {
    //* Preventing the function from continuing futher if the processing is true to avoid conflict
    if (this.isProcessing) {
      return;
    }

    //* Disable the formand showing procaessing meassage
    this.isProcessing = true;
    this.showProcessingMessage();

    //* Increment the Login Attempts
    this.authService.incrementLoginAttempts();
    this.getLoginAttempts();

    if (this.loginAttempts >= this.maxAttempts) {
      this.displaySnackBar('Error: Login attempts exceeded!');
    } else {
      this.userService.siginWithEmailAndPassword("admin", this.userInfo.email, this.userInfo.password)
      .then(() => {
        this.displaySnackBar("Welcome");
        this.isProcessing = false;
        localStorage.setItem(this.STORAGE_KEY, '0');
        this.router.navigate(['/admin/dashboard']);
      })
      .catch((error) => {
        this.displaySnackBar(error);
        this.isProcessing = false;
      })
    }
  }
}
