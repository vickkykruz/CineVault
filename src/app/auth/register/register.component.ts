import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/service/auth.service';
import { Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

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
    private service: AuthService,
    private title: Title) {}
  ngOnInit(): void {
    this.title.setTitle('Cruz Tv || Register');
  }

  id: any = this.routeId.snapshot.paramMap.get('id');
  submitForm() {
      // Process The Registration
      this.fireAuth.createUserWithEmailAndPassword(this.userInfo.email, this.userInfo.password)
      .then((response) => {
        // alert(this.userInfo.username);
        const datas: any = {
          id: response.user?.uid,
          status: 'active'
        };
        this.service.saveDataInSessionStorage(datas);
        this.service.sendVerificationEmail(response.user, this.userInfo.username); // Send a verfiied email

        const redirectDisplay: number = 5000;

        alert('Redirecting...');
        const timer$ = timer(redirectDisplay);


        timer$.pipe(take(1)).subscribe(() => {
          if (this.id != null) {
            this.router.navigate([`/movie/${this.id}`]);
          } else {
            this.router.navigate(['/home']);
          };
        });
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
