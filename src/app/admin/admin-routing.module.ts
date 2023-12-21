import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './pages/home/home.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { AdminAuthGuard } from './guard/admin-auth.guard';

const routes: Routes = [
  { path: '', canActivate: [AdminAuthGuard], component: AdminComponent,  children: [
    // Define the route here
    { path: 'dashboard', component: HomeComponent },
    { path: 'change-password', component: ChangePasswordComponent},
    { path: 'inbox', component: InboxComponent},
  ] },

  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
