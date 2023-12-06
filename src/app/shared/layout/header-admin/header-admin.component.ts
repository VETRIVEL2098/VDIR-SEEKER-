import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent {

  constructor(private router: Router){}
  isLoggedIn = true;
  isLoggedOut = false;

  signOut() {
    localStorage.clear();
    console.clear();
    this.router.navigate(['admin']);
  }


  cl9(value: any) {
    this.isLoggedIn = true
    this.isLoggedOut = value
    }
    cl10(value: any) {
      this.isLoggedOut = true
      this.isLoggedIn = value
      }
      func3(){
        this.router.navigateByUrl('auth/login')

    }
    func4(){
      this.router.navigateByUrl('auth/register')

  }

}
