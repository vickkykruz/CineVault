import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/service/auth.service';

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
    private fireAuth: AngularFireAuth,
    private router: Router,
    private service: AuthService) {}
  ngOnInit(): void {

  }

  id: any = this.routeId.snapshot.paramMap.get('id');
  submitForm() {
      // Process The Registration
      this.fireAuth.createUserWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
      .then((response) => {
        alert(this.userInfo.username);
        const datas: any = {
          id: response.user?.uid,
          status: 'active'
        };
        this.service.saveDataInSessionStorage(datas);
        this.service.sendVerificationEmail(response.user, this.userInfo.username); // Send a verfiied email
        if (this.id != null) {
          this.router.navigate([`/movie/${this.id}`]);
        } else {
          this.router.navigate(['/home']);
        };
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
