import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{

  navbar: any;
  authStatus: boolean = false;
  userData$!: Observable<any>;
  constructor(
    private service: AuthService,
    private routeId: ActivatedRoute,
    private router: Router
    ) {}

  loginStatus: boolean = this.service.arrayExistsInSessionStorage();
  docData!: any;
  // docData: any = this.service.getArrayDataInSessionStorage();
  // docKey = this.docData.id;

  ngOnInit(): void {
    this.getUserIdenty();
  }

  userData: any;
  id: any;

  async getUserIdenty(): Promise<void> {
    if (this.loginStatus == true) {
      this.authStatus = true;
      this.docData = this.service.getArrayDataInSessionStorage();
      const docKey = this.docData.id;
      console.log(docKey, "userId###");

      try {
        this.userData = await this.service.fetctdata(docKey);
        console.log(this.userData, "Status###");

      } catch (error) {
        console.log(error);
      }
      // this.userData = this.service.fetctdata(docKey);
    }
  }

  logout() {
    if (this.loginStatus == true){
      this.service.removeDataInSession();
      this.id = this.routeId.snapshot.paramMap.get('id');
      if (this.id != null) {
        this.router.navigate([`/movie/${this.id}`]);
      }else {
        this.router.navigate(['/home']);
      }
    }
  }


  @HostListener('document:scroll') scrollover() {
    console.log(document.body.scrollTop, 'scrolllength#');
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.navbar = {
        'background': 'rgba(0, 0, 0, 0.8)'
      }
    }else {
      this.navbar = {}
    }
  }
}
