import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from '../../auth/service/auth.service';


@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit, OnChanges{

  @Input() isChecked!: boolean;

  adminFirstName: string = '';
  adminLastName: string = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    ) {}



  ngOnInit() {
    this.displayAdminInfo();
    this.adminFirstName;
    this.adminLastName;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChecked']) {
      const currentChecked = changes['isChecked'].currentValue;
      const previousChecked = changes['isChecked'].previousValue;

      // console.log('isChecked changed from', previousChecked, 'to', currentChecked);
      // Perform desired actions when isChecked changes
    }
  }

  displayAdminInfo() {
    this.userService.getCurrentUserProfie().then(() => {
      this.authService.getAdminDetails().then((adminInfo: any) => {
        // Display the firstname and lastname
        this.adminFirstName = adminInfo.firstname;
        this.adminLastName = adminInfo.lastname;
        console.log(adminInfo);
      })
      .catch((err: any) => {
        this.adminFirstName = '{{ firstname }}';
        this.adminLastName = '{{ lastName }}';
      })
    })
    .catch(() => {
      this.adminFirstName = '{{ firstname }}';
      this.adminLastName = '{{ lastName }}';
    });
  }


  logout() {
    // Logout Admin
    this.userService.userSignOut().then(() => {
      // Redirect the admin tologin
      this.router.navigate(['/admin/auth/login']);
    })
    .catch((err) => {
      this.userService.displaySnackBar(err);
    });
  }
}
