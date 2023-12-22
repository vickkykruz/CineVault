import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Auth } from 'src/app/auth/auth';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from '../service/auth.service';

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
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private title: Title
    ) {}

  private getLoginAttempts() {
    this.loginAttempts = this.authService.getLoginAttempts();
  }
  private readonly STORAGE_KEY = 'loginAttempts';

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
    this.userService.showProcessingMessage();

    //* Increment the Login Attempts
    this.authService.incrementLoginAttempts();
    this.getLoginAttempts();

    if (this.loginAttempts >= this.maxAttempts) {
      this.userService.displaySnackBar('Error: Login attempts exceeded!');
    } else {
      this.userService.siginWithEmailAndPassword("admin", this.userInfo.email, this.userInfo.password)
      .then(() => {
        this.userService.displaySnackBar("Welcome");
        this.isProcessing = false;
        localStorage.setItem(this.STORAGE_KEY, '0');
        this.router.navigate(['/admin/dashboard']);
      })
      .catch((error) => {
        this.userService.displaySnackBar(error);
        this.isProcessing = false;
      })
    }
  }
}
