import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';

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
    private fireauth: AngularFireAuth,
    private service: MovieApiServiceService) {}
  ngOnInit(): void {

  }

  id: any = this.router.snapshot.paramMap.get('id');
  feedback!: any;
  user: any;
  submitForm() {
    this.fireauth.signInWithEmailAndPassword(this.userInfo.email, this.userInfo.password).then((response) =>
    {
      // this.user = response.user;
      // console.log(response);
      this.defaultError = {
        'display': 'block'
      }
      this.ValidateForm = true;
      // this.service.userEffect();

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
      }else {
        this.message = "Network connection failed";
      }
      this.ValidateForm = false;
      // this.message = err.message;

    });
  }


}
