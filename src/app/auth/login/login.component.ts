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

  ValidateForm!: boolean;
  defaultError = {
    'display' : 'none'
  }
  

  submitForm() {
    if (this.userInfo.email == 'onwuegbuchulemvic02@gmail.com' && this.userInfo.password == 'Vicchi232312') {
      this.ValidateForm = true;
    }else {
      this.ValidateForm = false;
      this.defaultError = {
        'display': 'block'
      }
    }
  }
}
