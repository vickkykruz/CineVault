import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthService } from 'src/app/service/auth.service';
import { take, timer } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { child, get, getDatabase, ref, set } from 'firebase/database';
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
    this.userService.siginWithEmailAndPassword("users", this.userInfo.email, this.userInfo.password)
    .then(() => {
      this.displaySnackBar("Welcome");
      this.isProcessing = false;
      if (this.id != null) {
        this.moveRoute.navigate([`/download/${this.id}`]);
      }else {
        this.moveRoute.navigate(['/home']);
      }
    })
    .catch((error) => {
      this.displaySnackBar(error);
      this.isProcessing = false;
    })
  }
}
