import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'search/:input', component: SearchComponent},
  {path: 'movie/:id', component: MovieDetailsComponent},
  {path: 'auth', component: AuthComponent, children: [
    {path: 'login', component: LoginComponent},
    {path: 'login/:id', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'register/:id', component: RegisterComponent},
    {path: 'forgotPassword', component: ForgotPasswordComponent},
    {path: 'forgotPassword/:id', component: ForgotPasswordComponent}
  ]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
