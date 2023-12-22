import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{

  navbar: any;
  authStatus!: boolean;

  constructor(
    private routeId: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    ) {}

  

  ngOnInit(): void {
    this.checkUserStatus();
  }

  id: any = this.routeId.snapshot.paramMap.get('id');

  checkUserStatus() {
    this.authStatus = this.userService.isLogging();
    console.log(this.authStatus);
  }

  logout() {
    this.userService.userSignOut()
    .then(() => {
      if (this.id != null) {
        this.router.navigate([`/movie/${this.id}`]);
      }else {
        this.router.navigate(['/home']);
      }
    })
    .catch((err) => {
      this.userService.displaySnackBar(err);
    });
  }


  @HostListener('document:scroll') scrollover() {
    // console.log(document.body.scrollTop, 'scrolllength#');
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.navbar = {
        'background': 'rgba(0, 0, 0, 0.8)'
      }
    }else {
      this.navbar = {}
    }
  }
}
