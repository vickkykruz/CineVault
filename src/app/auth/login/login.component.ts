import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError } from 'rxjs';

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

  message!:string;
  ValidateForm!: boolean;
  defaultError = {
    'display' : 'none'
  }

  constructor(
    private router: ActivatedRoute,
    private moveRoute: Router,
    private fireauth: AngularFireAuth) {}
  ngOnInit(): void {

  }

  id: any = this.router.snapshot.paramMap.get('id');

  submitForm() {
    this.fireauth.signInWithEmailAndPassword(this.userInfo.email, this.userInfo.password).then((response) =>
    {
      this.defaultError = {
        'display': 'block'
      }
      this.ValidateForm = true;
      sessionStorage.setItem('token', 'key');

      this.message = "Created an account successfully";

      if (this.id != null){
        this.moveRoute.navigate([`/movie/${this.id}`]);
      }else {
        this.moveRoute.navigate(['/home']);
      }

    }, err=> {
      this.defaultError = {
        'display': 'block'
      }

      if (err.message == "Firebase: Error (auth/user-not-found).") {
        this.message = "No Accound Found With The Email Address";
      }
      this.ValidateForm = false;
      // this.message = err.message;

    });
  }
}
