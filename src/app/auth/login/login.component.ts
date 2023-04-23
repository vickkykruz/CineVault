import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';

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

  ValidateForm!: boolean;
  defaultError = {
    'display' : 'none'
  }

  constructor(private router: ActivatedRoute, private moveRoute: Router) {}
  ngOnInit(): void {

  }

  id: any = this.router.snapshot.paramMap.get('id');

  submitForm() {
    if (this.userInfo.email == 'onwuegbuchulemvic02@gmail.com' && this.userInfo.password == 'Vicchi232312') {
      if (this.id == null){
        this.moveRoute.navigate(['/home']);
      }else {
        this.moveRoute.navigate([`/movie/${this.id}`]);
      }
      this.ValidateForm = true;
    }else {
      this.ValidateForm = false;
      this.defaultError = {
        'display': 'block'
      }
    }
  }
}
