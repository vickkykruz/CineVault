import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit, OnChanges{

  @Input() isChecked!: boolean;

  adminFirstName: string = '{{ firstname }}';
  adminLastName: string = '{{ lastName }}';
  constructor(
    private router: Router,
    private authService: AuthService
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
    this.authService.getAdminDetails().then((adminInfo: any) => {
    // Display the firstname and lastname
      this.adminFirstName = adminInfo.firstname;
      this.adminLastName = adminInfo.lastname;
      console.log(adminInfo);
    })
    .catch((err: any) => {
      console.warn(err);
    })
  }


  logout() {
    // Logout Admin
    sessionStorage.removeItem('SSID');
    sessionStorage.setItem('isAuthenticated', 'false');
    sessionStorage.removeItem('userCatigory');
    // Redirect the admin tologin
    this.router.navigate(['/admin/auth/login']);
  }
}
