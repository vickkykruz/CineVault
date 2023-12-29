import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';

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
  isProcessing: boolean = false;
  // usage_status: boolean = this.service.userEffect();

  constructor(
    private routeId: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private title: Title) {}
  ngOnInit(): void {
    this.title.setTitle('Cruz Tv || Register');
  }

  id: any = this.routeId.snapshot.paramMap.get('id');
  submitForm() {
      //* Preventing the function from continuing futher if the processing is true to avoid conflict
    if (this.isProcessing) {
      return;
    }

    //* Disable the formand showing procaessing meassage
    this.isProcessing = true;
    this.userService.showProcessingMessage();
    this.userService.createUserWihEmailAndPassword("users", this.userInfo.email, this.userInfo.password)
    .then(() => {
      this.userService.displaySnackBar("Welcome");
      this.isProcessing = false;
      if (this.id != null) {
        this.router.navigate([`/download/${this.id}`]);
      }else {
        this.router.navigate(['/home']);
      }
    })
    .catch((error) => {
      this.userService.displaySnackBar(error);
      this.isProcessing = false;
    })
  }
}
