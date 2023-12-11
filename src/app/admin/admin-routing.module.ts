import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './pages/home/home.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { InboxComponent } from './pages/inbox/inbox.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'home', component: HomeComponent },
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'inbox', component: InboxComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
