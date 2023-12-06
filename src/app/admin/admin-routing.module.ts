import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { PostedjobsComponent } from './postedjobs/postedjobs.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventComponent } from './event/event.component';

const routes: Routes = [{path: '', children:[
  // {path:'jobs', loadComponent:()=>import('./jobs/jobs.component').then(x=>x.JobsComponent)},
  {path:'jobs', component:JobsComponent},
  {path:"candidates/:id", component:CandidatesComponent},
  {path:"dashboard", component:DashboardComponent},
  {path:"event", component:EventComponent},
  {path:'preview-profile', component:PostedjobsComponent},
  {path:'edit-profile', component:UserprofileComponent},
  // {path:'candidates', loadComponent:()=>import('./candidates/candidates.component').then(x=>x.CandidatesComponent)},
  {path:'candidate-info/:id', loadComponent:()=>import('./candidate-info/candidate-info.component').then(x=>x.CandidateInfoComponent)},
  // {path:'basic-profile', loadComponent:()=>import('./postedjobs/postedjobs.component').then(x=>x.PostedjobsComponent)},
  // {path:'userprofile', loadComponent:()=>import('./userprofile/userprofile.component').then(x=>x.UserprofileComponent)},
  // {},
  // {}
]}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
