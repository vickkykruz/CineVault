import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './pages/home/home.component';
import { AsideBarComponent } from './partials/aside-bar/aside-bar.component';
import { NavComponent } from './partials/nav/nav.component';


@NgModule({
  declarations: [
    AdminComponent,
    HomeComponent,
    AsideBarComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
