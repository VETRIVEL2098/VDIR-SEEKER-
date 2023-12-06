import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{path: '', children:[
  {path:'login', loadComponent:()=>import('./login/login.component').then(x=>x.LoginComponent)},
  {path:'register/:id', loadComponent:()=>import('./registration/registration.component').then(x=>x.RegistrationComponent)},
  {path:'reset', loadComponent:()=>import('./reset-password/reset-password.component').then(x=>x.ResetPasswordComponent)}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
