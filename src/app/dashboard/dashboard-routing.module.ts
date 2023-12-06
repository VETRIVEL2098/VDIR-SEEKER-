import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { EventListComponent } from './event-list/event-list.component';
import { AgendaAddComponent } from './agenda-add/agenda-add.component';

const routes: Routes = [
  {path:'', children:[
  // {path:'home',component:HomeComponent},

  {path:'companies-info/:id', loadComponent:()=>import('./cvbuilder/cvbuilder.component').then(x=>x.CvbuilderComponent)},
  // {path:'job-details', loadComponent:()=>import('./job-details/job-details.component').then(x=>x.JobDetailsComponent)},
  {path:'profile', loadComponent:()=>import('./profile/profile.component').then(x=>x.ProfileComponent)},
  // {path:'companies', loadComponent:()=>import('./companies/companies.component').then(x=>x.CompaniesComponent)},
  {path:'createcv', loadComponent:()=>import('./createcv/createcv.component').then(x=>x.CreatecvComponent)},
  {path:'viewmorejob/:id', loadComponent:()=>import('./viewmorejob/viewmorejob.component').then(x=>x.ViewmorejobComponent)},
  // {
  //   path: ':business-category/:company/:job/:role',
  //   loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
  // },
  // {
  //   path: ':business-category/:company/:job',
  //   loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
  // },
  // {
  //   path: ':business-category/:company',
  //   loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
  // },{

  // {path:'applied-jobs', loadComponent:()=>import('./applied-jobs/applied-jobs.component').then(x=>x.AppliedJobsComponent)}
{path:'applied-jobs',component:AppliedJobsComponent},
{path:'agenda-add',component:AgendaAddComponent},

// {path:'job-details',component:JobDetailsComponent},
// {path:':business-category/:company/:job/:role', loadComponent:()=>import('./category/category.component').then(x=>x.CategoryComponent)},
{path: "event-list",
  children: [
   {
    path: "",
    component:EventListComponent ,
   },
   {
    path: ":id",
    component:EventListComponent
   },
  ],
 },
{path: ":business-category",
  children: [
   {
    path: "",
    component:CategoryComponent ,
   },
   {
    path: ":company",
   children:[
    {
      path:'',
      component: CategoryComponent ,
    },
    {
      path: ":job/:role",
      component: CategoryComponent,
     }
   ]
   },



  ],
 },


]
}
// ,
// {path:':business-category/:company/?:job/?:role',component:CategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
