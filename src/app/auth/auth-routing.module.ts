import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'login/:id', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register/:id', component: RegisterComponent},
  {path: 'forgotPassword', component: ForgotPasswordComponent},
  {path: 'forgotPassword/:id', component: ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { };
