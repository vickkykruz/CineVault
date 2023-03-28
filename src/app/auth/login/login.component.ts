import { Component } from '@angular/core';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  userInfo: Auth = {
    email: '',
    password: ''
  }
}
