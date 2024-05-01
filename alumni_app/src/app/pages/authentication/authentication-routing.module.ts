import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password/reset-password.component';
import { RequestPasswordComponent } from './request-password/request-password/request-password.component';
import { tokenExistsGuard } from './token-exists.guard';
import { sessionGuardGuard } from './session-guard.guard';

const routes: Routes = [
{ path:'login', component:LoginComponent, canActivate: [sessionGuardGuard] },
    { path:'register', component: RegisterComponent, canActivate: [sessionGuardGuard]},
    { path: 'login/request-password', component: RequestPasswordComponent },
    { path: 'login/reset-password', component: ResetPasswordComponent, canActivate: [tokenExistsGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
