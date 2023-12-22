import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';

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
  isProcessing: boolean = false;

  message!:string;
  ValidateForm!: boolean;
  defaultError = {
    'display' : 'none'
  }

  constructor(
    private router: ActivatedRoute,
    private moveRoute: Router,
    private userService: UserService,
    private title: Title) {}
  
  ngOnInit(): void {
    this.title.setTitle('Cruz Tv || Login');
  }

  id: any = this.router.snapshot.paramMap.get('id');
  feedback!: any;
  user: any;
  submitForm() {
    //* Preventing the function from continuing futher if the processing is true to avoid conflict
    if (this.isProcessing) {
      return;
    }

    //* Disable the formand showing procaessing meassage
    this.isProcessing = true;
    this.userService.showProcessingMessage();
    this.userService.siginWithEmailAndPassword("users", this.userInfo.email, this.userInfo.password)
    .then(() => {
      this.userService.displaySnackBar("Welcome");
      this.isProcessing = false;
      if (this.id != null) {
        this.moveRoute.navigate([`/download/${this.id}`]);
      }else {
        this.moveRoute.navigate(['/home']);
      }
    })
    .catch((error) => {
      this.userService.displaySnackBar(error);
      this.isProcessing = false;
    })
  }
}
