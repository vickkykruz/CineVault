import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';
import { UserDertail } from 'src/app/service/userdetails';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userInfo:Auth = {
    username: '',
    email:  '',
    password: ''
  }

  message!:string;
  ValidateForm!: boolean;

  defaultError = {
    'display' : 'none'
  }
  // usage_status: boolean = this.service.userEffect();

  constructor(
    private routeId: ActivatedRoute,
    private route: Router,
    private fireAuth: AngularFireAuth,
    private service: MovieApiServiceService) {}
  ngOnInit(): void {

  }

  id: any = this.routeId.snapshot.paramMap.get('id');
  submitForm() {
      // Process The Registration
      this.fireAuth.createUserWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
      .then((response) => {
        console.log(response, "#** UserData'");
        const UserData: UserDertail = {
          displayName: this.userInfo.username,
          email: response.user.em,
          uid: ,
          id: ''
        }
        // this.service.sendVerificationEmail(response.user, this.id, this.userInfo.username); // Send a verfiied email
      })
      .catch((err) => {
        this.defaultError = {
          'display': 'block'
        }

        if (err.message == "Firebase: Error (auth/user-not-found).") {
          this.message = "No Accound Found With The Email Address";
        }else {
          this.message = "Network connection failed";
        }
        this.ValidateForm = false;
      })
  }
}
