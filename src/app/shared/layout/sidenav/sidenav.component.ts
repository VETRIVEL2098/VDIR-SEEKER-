import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  constructor(private router:Router){}

  route1(){
    this.router.navigateByUrl('admin/jobs')
  }

  route2(){
    this.router.navigate(['admin/candidates/all'])
  }
  route3(){
    this.router.navigateByUrl('admin/edit-profile')
  }
  route5(){
    this.router.navigateByUrl('admin/dashboard')
  }
  route4(){
    this.router.navigateByUrl('admin/preview-profile')
  }
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}
