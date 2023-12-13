import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Auth } from 'src/app/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  userInfo: Auth = {
    email: '',
    password: ''
  }

  constructor (private title: Title) {}

  ngOnInit(): void {
      this.title.setTitle("CruzTv || Adminstartion Portal");
  }

  message!:string;

  submitForm() {}
}
